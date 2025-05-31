import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Response,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailLoginDto } from './dto/login.dto';
import { Public } from './decorator/public.decorator';
import { Response as EResponse } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  EmailLogin(
    @Body() emailLoginDto: EmailLoginDto,
    @Response({ passthrough: true }) res: EResponse,
  ): Promise<any> {
    return this.authService.signIn(
      emailLoginDto.username,
      emailLoginDto.password,
      res,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  Verify(@Response({ passthrough: true }) res: EResponse) {
    return this.authService.verify(res);
  }
}
