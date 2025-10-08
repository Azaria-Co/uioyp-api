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
import { memoryStorage, diskStorage } from 'multer'; 
import { extname, join } from 'path';
import { Response } from 'express';

@Controller('multimedia')
export class MultimediaController {
  constructor(private readonly multimediaService: MultimediaService) {}

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.multimediaService.findById(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        cb(null, true);
      } else {
        cb(new Error('Solo se permiten archivos de imagen'), false);
      }
    },
    limits: {
      fileSize: 10 * 1024 * 1024, 
    },
  }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('id_post') id_post?: string
  ) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    let base64Data: string | null = null;
    const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${extname(file.originalname)}`;
    
    try {
      const buffer = file.buffer;
      base64Data = `data:${file.mimetype};base64,${buffer.toString('base64')}`;
    } catch (err) {
      console.error('Error procesando buffer:', err);
      base64Data = null;
    }

    const savedFile = await this.multimediaService.saveFileInfo({
      filename: uniqueFilename, 
      original_name: file.originalname,
      file_path: uniqueFilename, 
      file_size: file.size,
      mime_type: file.mimetype,
      id_post: id_post ? parseInt(id_post) : null,
      contenido_blob: base64Data,
    });

    return {
      message: 'Archivo subido exitosamente',
      file: savedFile,
      url: `/multimedia/file/${savedFile.id}`, 
    };
  }

  @Get('file/:id')
  async serveFile(@Param('id') id: string, @Res() res: Response) {
    try {
      const multimediaRow = await this.multimediaService.findById(parseInt(id));
      
      if (!multimediaRow) {
        return res.status(404).json({ message: 'Archivo no encontrado' });
      }

      if (multimediaRow.contenido_blob) {
        const base64Data = multimediaRow.contenido_blob as string;
        
        const mimeMatch = base64Data.match(/^data:([^;]+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
        const base64Only = base64Data.replace(/^data:[^;]+;base64,/, '');
        
        const buffer = Buffer.from(base64Only, 'base64');
        
        res.set({
          'Content-Type': mimeType,
          'Content-Length': buffer.length,
          'Cache-Control': 'public, max-age=31536000',
        });
        
        return res.send(buffer);
      }
      
      return res.status(404).json({ message: 'Contenido multimedia no disponible en Base64.' });
      
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

    if (body.tipo === 'video') {
      const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
      if (!youtubeRegex.test(body.url)) {
        throw new BadRequestException('URL de YouTube inválida');
      }
    } else if (body.tipo === 'link') {
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
