import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Asegurar que existe la carpeta uploads
  const uploadsDir = join(process.cwd(), 'uploads');
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Carpeta uploads creada');
  }
  
  // Configurar CORS para permitir conexiones desde la app frontend
  app.enableCors({
    origin: true, // En producción especifica el dominio de tu app
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Configurar limite de tamaño para uploads
  app.use((req: any, res: any, next: any) => {
    if (req.url.includes('/multimedia/upload')) {
      req.setTimeout(300000); // 5 minutos para uploads
    }
    next();
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
