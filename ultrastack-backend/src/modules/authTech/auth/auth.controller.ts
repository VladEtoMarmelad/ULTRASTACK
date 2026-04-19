import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Req, 
  Res, // Import Response decorator
  UseGuards 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../../../types/User';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: Partial<User>) {
    return this.authService.register(createUserDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Guard redirects to Google's login page.
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) { // Inject Response object
    const user = await this.authService.validateOAuthUser(req.user, 'google');
    const { access_token } = await this.authService.login(user);

    // Redirect back to frontend with the JWT as a query parameter
    return res.redirect(`http://localhost:3000/authSuccess?token=${access_token}`);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Req() req) {
    // Guard redirects to GitHub's login page.
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Req() req, @Res() res) { // Inject Response object
    const user = await this.authService.validateOAuthUser(req.user, 'github');
    const { access_token } = await this.authService.login(user);

    // Redirect back to frontend with the JWT as a query parameter
    return res.redirect(`http://localhost:3000/authSuccess?token=${access_token}`);
  }
}