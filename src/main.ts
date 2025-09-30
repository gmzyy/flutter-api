// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Habilita CORS para permitir peticiones desde Flutter/Web u otros clientes
  app.enableCors({
    origin: true,        // puedes restringir con ['http://localhost:1234']
    credentials: true,
  });

  // ✅ Valida automáticamente todos los DTOs y limpia campos no permitidos
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,             // elimina campos no definidos en el DTO
    forbidNonWhitelisted: true,  // si envían campos extra => 400
    transform: true,             // transforma a los tipos del DTO
    stopAtFirstError: true,      // detiene en el primer error
  }));

  // ✅ Escucha en todas las interfaces (para que se pueda acceder desde la red local)
  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 API corriendo en http://localhost:${port}`);
}
bootstrap();
