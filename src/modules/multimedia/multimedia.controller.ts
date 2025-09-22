import { 
  Controller, 
  Get, 
  Post, 
  Param, 
  UploadedFile, 
  UseInterceptors,
  Body,
  Res,
  BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MultimediaService } from './multimedia.service.js';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Response } from 'express';
import { existsSync } from 'fs';

@Controller('multimedia')
export class MultimediaController {
  constructor(private readonly multimediaService: MultimediaService) {}

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.multimediaService.findById(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        // Generar nombre único: timestamp + random + extensión original
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      // Solo permitir imágenes
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        cb(null, true);
      } else {
        cb(new Error('Solo se permiten archivos de imagen'), false);
      }
    },
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB máximo
    },
  }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('id_post') id_post?: string
  ) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    // Leer el buffer del archivo subido
    const fs = await import('fs/promises');
    let buffer: Buffer | null = null;
    try {
      buffer = await fs.readFile(file.path);
    } catch (err) {
      buffer = null;
    }

    const savedFile = await this.multimediaService.saveFileInfo({
      filename: file.filename,
      original_name: file.originalname,
      file_path: file.path,
      file_size: file.size,
      mime_type: file.mimetype,
      id_post: id_post ? parseInt(id_post) : null,
      contenido_blob: buffer,
    });

    return {
      message: 'Archivo subido exitosamente',
      file: savedFile,
      url: `/multimedia/file/${file.filename}`,
    };
  }

  @Get('file/:filename')
  async serveFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads', filename);
    const fs = await import('fs/promises');
    if (existsSync(filePath)) {
      return res.sendFile(filePath);
    }
    // Si no existe en disco, buscar en la base por descripcion
    const multimediaRow = await this.multimediaService.findByDescripcion(filename);
    if (!multimediaRow || !multimediaRow.contenido_blob) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }
    // Determinar el mime type
    const mimeType = (multimediaRow as any).mime_type || 'image/jpeg';
    const blobBuffer = Buffer.isBuffer(multimediaRow.contenido_blob)
      ? multimediaRow.contenido_blob as Buffer
      : Buffer.from(multimediaRow.contenido_blob as any);
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', blobBuffer.length);
    return res.send(blobBuffer);
  }

  @Get('post/:postId')
  async getPostMedia(@Param('postId') postId: number) {
    return this.multimediaService.findByPostId(postId);
  }

  @Post('advanced')
  async createAdvancedMultimedia(@Body() body: {
    tipo: 'video' | 'link';
    id_post: number;
    url: string;
    titulo?: string;
    descripcion?: string;
  }) {
    if (!body.tipo || !body.id_post || !body.url) {
      throw new BadRequestException('Tipo, id_post y URL son obligatorios');
    }

    // Validaciones específicas por tipo
    if (body.tipo === 'video') {
      // Validar que sea una URL de YouTube
      const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
      if (!youtubeRegex.test(body.url)) {
        throw new BadRequestException('URL de YouTube inválida');
      }
    } else if (body.tipo === 'link') {
      // Validar que sea una URL válida
      try {
        new URL(body.url);
      } catch {
        throw new BadRequestException('URL inválida');
      }
    }

    const savedMultimedia = await this.multimediaService.saveMultimediaInfo({
      tipo: body.tipo,
      id_post: body.id_post,
      url: body.url,
      titulo: body.titulo,
      descripcion: body.descripcion,
    });

    return {
      message: 'Multimedia creado exitosamente',
      multimedia: savedMultimedia,
    };
  }
}