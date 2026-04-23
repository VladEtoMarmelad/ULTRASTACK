import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { GithubUser } from '../../types/GithubUser';

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
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: Error | null, user: GithubUser) => void,
  ): Promise<GithubUser> {
    const { displayName, username, emails, photos, id } = profile;

    const user: GithubUser = {
      // GitHub might return private emails if scoped
      email: emails && emails.length > 0 ? emails[0].value : '',
      displayName: displayName || username || '',
      photos: photos && photos.length > 0 ? photos[0].value : '',
      id: id, // The external ID from GitHub
    };

    done(null, user);
    return user;
  }
}