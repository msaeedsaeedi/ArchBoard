import {
  Controller,
  Post,
  UseGuards,
  Response,
  HttpStatus,
  HttpCode,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local.guard';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { Response as EResponse } from 'express';
import { GoogleOauthGuard } from './guards/google.guard';
import { User } from 'generated/prisma';
import { ApiConfigService } from 'src/config/apiConfig.service';
import { Environment } from 'src/config/types';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private apiConfigService: ApiConfigService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() request,
    @Response({ passthrough: true }) response: EResponse,
  ) {
    const user = request.user as User;
    await this.authService.login(user.Email, user.UserId.toString(), response);
  }

  @Get('google')
  @Public()
  @UseGuards(GoogleOauthGuard)
  async auth() {}

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() request, @Res() response: EResponse) {
    const user = request.user as User;
    await this.authService.login(user.Email, user.UserId.toString(), response);
    response.redirect(this.apiConfigService.AUTH_CALLBACK);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Response() res: any) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === Environment.Production,
      path: '/',
    });
    return res.status(200).json({ message: 'Logged out successfully' });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  Verify() {
    // Placeholder route for verification
    // Cookie Verification is Handled by Auth Guard
  }
}
