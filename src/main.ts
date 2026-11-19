import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
  origin: 'http://localhost:3001',
  });
  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // Remove propriedades que não estão no DTO
    forbidNonWhitelisted: true, // Lança erro se houver propriedades que não estão no DTO
    transform: true, // Transforma os tipos de dados para os tipos esperados
  }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
