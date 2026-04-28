import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Req, 
  Res, 
  UseGuards,
  UnauthorizedException
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { OAuthProfile } from '../../../types/OAuthProfile';
import { AuthService } from './auth.service';
import { User } from '@sharedTypes/User';
import { AuthGuard } from '@nestjs/passport';

interface AuthenticatedRequest extends Request {
  user: OAuthProfile;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: Partial<User>) {
    return this.authService.register(createUserDto);
  }

  // Endpoint to exchange a refresh token for a new access token
  @Post('refresh')
  async refresh(@Body('refresh_token') refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException('No refresh token provided');
    return this.authService.refresh(refreshToken);
  }

  // Returns current user profile based on JWT
  @Get('me')
  @UseGuards(AuthGuard('jwt')) // Assumes JwtStrategy is configured
  async getMe(@Req() req: Request & { user: { sub: number } }) {
    const user = await this.authService['usersService'].findOne(req.user.sub);
    return user;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() _req: Request) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const user = await this.authService.validateOAuthUser(req.user, 'google');
    const tokens = await this.authService.login(user);

    // Properly encode tokens for URL transmission
    const encodedAccessToken = encodeURIComponent(tokens.access_token);
    const encodedRefreshToken = encodeURIComponent(tokens.refresh_token);
    
    return res.redirect(`http://localhost:3000/authSuccess?token=${encodedAccessToken}&refresh_token=${encodedRefreshToken}`);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Req() _req: Request) {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const user = await this.authService.validateOAuthUser(req.user, 'github');
    const tokens = await this.authService.login(user);

    // Properly encode tokens for URL transmission
    const encodedAccessToken = encodeURIComponent(tokens.access_token);
    const encodedRefreshToken = encodeURIComponent(tokens.refresh_token);
    
    return res.redirect(`http://localhost:3000/authSuccess?token=${encodedAccessToken}&refresh_token=${encodedRefreshToken}`);
  }
}