import { type CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const CorsOptions: CorsOptions = {
  origin: ['http://localhost:4200'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
  maxAge: 86400,
};

export { CorsOptions };
