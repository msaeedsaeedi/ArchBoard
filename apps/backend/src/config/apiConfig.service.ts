import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment, GOOGLE_ENV } from './types';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get AUTH_CALLBACK(): string {
    return this.configService.get<string>('AUTH_CALLBACK')!;
  }

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

  get GOOGLE(): GOOGLE_ENV {
    const clientID = this.configService.get<string>('GOOGLE.CLIENT_ID')!;
    const clientSecret = this.configService.get<string>(
      'GOOGLE.CLIENT_SECRET',
    )!;
    const callbackURL = this.configService.get<string>('GOOGLE.CALLBACK_URL')!;

    return {
      CLIENT_ID: clientID,
      CLIENT_SECRET: clientSecret,
      CALLBACK_URL: callbackURL,
    };
  }
}
