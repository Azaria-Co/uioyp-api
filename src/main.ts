import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { join } from 'path';
import { existsSync, mkdirSync, readFileSync } from 'fs';

async function bootstrap() {
  // Configurar HTTPS si los certificados están disponibles
  let httpsOptions: { key: Buffer; cert: Buffer } | undefined = undefined;
  
  try {
    const keyPath = join(process.cwd(), 'private-key.pem');
    const certPath = join(process.cwd(), 'certificate.pem');
    
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

  const port = process.env.PORT ?? 3001;
  const host = process.env.HOST ?? '0.0.0.0';
  
  await app.listen(port, host);
  
  const protocol = httpsOptions ? 'https' : 'http';
  console.log(`🚀 Servidor corriendo en ${protocol}://${host}:${port}`);
}
bootstrap();
