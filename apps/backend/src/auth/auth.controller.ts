import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailLoginDto } from './dto/login.dto';
import { Public } from './decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  EmailLogin(@Body() emailLoginDto: EmailLoginDto) {
    return this.authService.signIn(
      emailLoginDto.username,
      emailLoginDto.password,
    );
  }
}
