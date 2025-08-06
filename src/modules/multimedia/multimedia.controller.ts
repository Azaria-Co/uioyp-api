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

    const savedFile = await this.multimediaService.saveFileInfo({
      filename: file.filename,
      original_name: file.originalname,
      file_path: file.path,
      file_size: file.size,
      mime_type: file.mimetype,
      id_post: id_post ? parseInt(id_post) : null,
    });

    return {
      message: 'Archivo subido exitosamente',
      file: savedFile,
      url: `/multimedia/file/${file.filename}`, // URL para acceder al archivo
    };
  }

  @Get('file/:filename')
  async serveFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads', filename);
    
    if (!existsSync(filePath)) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }

    return res.sendFile(filePath);
  }

  @Get('post/:postId')
  async getPostMedia(@Param('postId') postId: number) {
    return this.multimediaService.findByPostId(postId);
  }
}