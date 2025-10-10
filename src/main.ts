// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { join } from 'path';
import { existsSync, mkdirSync, readFileSync } from 'fs';

async function bootstrap() {
  let httpsOptions: { key: Buffer; cert: Buffer } | undefined = undefined;
  
  try {
    const keyPath = join(process.cwd(), 'UNAM_RSA_OV_SSL_CA.pem');
    const certPath = join(process.cwd(), 'UNAM_RSA_OV_SSL_CA.crt');
    
    if (existsSync(keyPath) && existsSync(certPath)) {
      httpsOptions = {
        key: readFileSync(keyPath),
        cert: readFileSync(certPath),
      };
      console.log('🔒 Certificados SSL encontrados, iniciando en modo HTTPS');
    } else {
      console.log('⚠️  Certificados SSL no encontrados, iniciando en modo HTTP');
    }
  } catch (error) {
    console.log('⚠️  Error al cargar certificados SSL, iniciando en modo HTTP');
  }

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  
  const uploadsDir = join(process.cwd(), 'uploads');
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Carpeta uploads creada');
  }
  
  app.enableCors({
    origin: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use((req: any, res: any, next: any) => {
    if (req.url.includes('/multimedia/upload')) {
      req.setTimeout(300000); // 5 minutos para uploads
    }
    next();
  });

  const port = process.env.PORT ?? 3001;
  const host = process.env.HOST ?? '0.0.0.0';
  
  await app.listen(port, host);
  
  const protocol = httpsOptions ? 'https' : 'http';
  console.log(`🚀 Servidor corriendo en ${protocol}://${host}:${port}`);
}
bootstrap();