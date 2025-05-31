import { Dependencies, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from './types';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get PORT(): number {
    return this.configService.get<number>('PORT') || 3001;
  }

  get ENVIRONMENT(): Environment {
    return (
      this.configService.get<Environment>('NODE_ENV') || Environment.Development
    );
  }

  get JWT_SECRET(): string {
    return this.configService.get<string>('JWT_SECRET')!;
  }

  get JWT_EXPIRESIN(): string {
    return this.configService.get<string>('JWT_EXPIRESIN')!;
  }

  get ORIGINS(): string[] | undefined {
    const str = this.configService.get<string>('ORIGIN');

    return str
      ?.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);
  }
}
