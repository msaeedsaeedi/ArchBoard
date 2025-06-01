import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';
import { Environment } from './types';

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  AUTH_CALLBACK: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRESIN: string;

  @IsString()
  @IsOptional()
  ORIGIN: string;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  'GOOGLE.CLIENT_ID': string;

  @IsString()
  'GOOGLE.CLIENT_SECRET': string;

  @IsString()
  'GOOGLE.CALLBACK_URL': string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
