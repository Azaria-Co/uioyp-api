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

    // Leer el buffer del archivo subido y convertir a base64
    const fs = await import('fs/promises');
    let base64Data: string | null = null;
    try {
      const buffer = await fs.readFile(file.path);
      base64Data = `data:${file.mimetype};base64,${buffer.toString('base64')}`;
    } catch (err) {
      console.error('Error leyendo archivo:', err);
      base64Data = null;
    }

    const savedFile = await this.multimediaService.saveFileInfo({
      filename: file.filename,
      original_name: file.originalname,
      file_path: file.path,
      file_size: file.size,
      mime_type: file.mimetype,
      id_post: id_post ? parseInt(id_post) : null,
      contenido_blob: base64Data, // Guardar como base64
    });

    return {
      message: 'Archivo subido exitosamente',
      file: savedFile,
      url: `/multimedia/file/${savedFile.id}`, // Usar ID en lugar de filename
    };
  }

  @Get('file/:id')
  async serveFile(@Param('id') id: string, @Res() res: Response) {
    try {
      // Buscar por ID primero
      const multimediaRow = await this.multimediaService.findById(parseInt(id));
      
      if (!multimediaRow) {
        return res.status(404).json({ message: 'Archivo no encontrado' });
      }

      // Si tiene contenido_blob (base64), servirlo desde la base de datos
      if (multimediaRow.contenido_blob) {
        const base64Data = multimediaRow.contenido_blob as string;
        
        // Extraer el tipo MIME del base64
        const mimeMatch = base64Data.match(/^data:([^;]+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        
        // Extraer solo los datos base64 (sin el prefijo data:)
        const base64Only = base64Data.replace(/^data:[^;]+;base64,/, '');
        const buffer = Buffer.from(base64Only, 'base64');
        
        res.set({
          'Content-Type': mimeType,
          'Content-Length': buffer.length,
          'Cache-Control': 'public, max-age=31536000', // Cache por 1 año
        });
        
        return res.send(buffer);
      }
      
      // Fallback: servir desde archivo físico si no hay base64
      if (multimediaRow.url) {
        const fs = await import('fs/promises');
        const fileExists = await fs.access(multimediaRow.url).then(() => true).catch(() => false);
        
        if (fileExists) {
          const file = await fs.readFile(multimediaRow.url);
          res.set({
            'Content-Type': 'image/jpeg',
            'Content-Length': file.length,
            'Cache-Control': 'public, max-age=31536000',
          });
          return res.send(file);
        }
      }
      
      return res.status(404).json({ message: 'Archivo no encontrado' });
      
    } catch (error) {
      console.error('Error sirviendo archivo:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
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