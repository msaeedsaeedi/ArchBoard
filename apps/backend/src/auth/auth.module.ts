import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigService } from 'src/config/apiConfig.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (apiConfigService: ApiConfigService) => ({
        secret: apiConfigService.JWT_SECRET,
        signOptions: { expiresIn: apiConfigService.JWT_EXPIRESIN },
      }),
      inject: [ApiConfigService],
      extraProviders: [ApiConfigService],
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    GoogleStrategy,
    JwtStrategy,
    ApiConfigService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
