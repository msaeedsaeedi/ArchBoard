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
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() request,
    @Response({ passthrough: true }) response: EResponse,
  ) {
    const user = request.user as User;
    await this.authService.login(user.email, user.userId, response);
  }

  @Get('google')
  @Public()
  @UseGuards(GoogleOauthGuard)
  async auth() {}

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: EResponse) {
    await this.authService.googleLogin(req.user as User, res);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Response() res: any) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
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
