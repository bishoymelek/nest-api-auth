// import helmet from 'helmet';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // app.use(helmet());
  app.use(compression());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
