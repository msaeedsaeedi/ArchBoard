import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ApiConfigService } from './config/apiConfig.service';

export const createCorsOptions = (configService: ApiConfigService): CorsOptions => ({
  origin: configService.ORIGINS,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
  maxAge: 86400,
});
