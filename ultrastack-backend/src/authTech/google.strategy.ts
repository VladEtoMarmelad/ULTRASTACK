import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      // Credentials obtained from Google Cloud Console
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'http://localhost:3030/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  // This method extracts user data from the Google profile after successful login
  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      displayName: `${name.givenName} ${name.familyName}`,
      photos: photos,
      id: profile.id, // The external ID from Google
    };
    done(null, user);
  }
}