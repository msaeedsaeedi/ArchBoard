import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { createCorsOptions } from './cors.options';
import * as cookieParser from 'cookie-parser';
import { ApiConfigService } from './config/apiConfig.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ApiConfigService);

  app.enableCors(createCorsOptions(configService));
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  const PORT = configService.PORT;
  await app.listen(PORT);
}
bootstrap().catch((e) => console.error(e));
