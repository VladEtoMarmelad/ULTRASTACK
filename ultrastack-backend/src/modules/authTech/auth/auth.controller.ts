import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Req, 
  Res, // Import Response decorator
  UseGuards 
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { OAuthProfile } from '../../../types/OAuthProfile';
import { AuthService } from './auth.service';
import { User } from '../../../types/User';
import { AuthGuard } from '@nestjs/passport';

// Interface to represent the request object populated by Passport strategies
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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() _req: Request) { // Request parameter typed for consistency
    // Guard redirects to Google's login page.
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: AuthenticatedRequest, @Res() res: Response) { // Inject Response object
    // req.user is populated by the GoogleStrategy validate method
    const user = await this.authService.validateOAuthUser(req.user, 'google');
    const { access_token } = await this.authService.login(user);

    // Redirect back to frontend with the JWT as a query parameter
    return res.redirect(`http://localhost:3000/authSuccess?token=${access_token}`);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Req() _req: Request) { // Request parameter typed for consistency
    // Guard redirects to GitHub's login page.
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Req() req: AuthenticatedRequest, @Res() res: Response) { // Inject Response object
    // req.user is populated by the GithubStrategy validate method
    const user = await this.authService.validateOAuthUser(req.user, 'github');
    const { access_token } = await this.authService.login(user);

    // Redirect back to frontend with the JWT as a query parameter
    return res.redirect(`http://localhost:3000/authSuccess?token=${access_token}`);
  }
}