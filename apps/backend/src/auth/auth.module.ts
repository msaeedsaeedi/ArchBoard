import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { ApiConfigService } from 'src/config/apiConfig.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, ApiConfigService],
})
export class AuthModule {}
