import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      // Credentials obtained from GitHub Developer Settings
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: 'http://localhost:3030/auth/github/callback',
      scope: ['user:email'],
    });
  }

  // This method extracts user data from the GitHub profile after successful login
  async validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any> {
    const { displayName, username, email, emails, photos } = profile;

    const user = {
      email: emails[0].value, // GitHub might return private emails if scoped
      displayName: displayName || username,
      photos: photos[0].value,
      id: profile.id, // The external ID from GitHub
    };

    console.log(user)
    done(null, user);
  }
}