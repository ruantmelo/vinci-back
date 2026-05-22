import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const logger = new Logger();
const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory(validationErrors: ValidationError[]) {
        return new BadRequestException(validationErrors);
      },
    }),
  );

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, Accept',
    credentials: true,
    maxAge: 86400,
  });

  await app.listen(PORT);

  logger.log(` Server is running on http://localhost:${PORT} 🚀`);
}
bootstrap();
