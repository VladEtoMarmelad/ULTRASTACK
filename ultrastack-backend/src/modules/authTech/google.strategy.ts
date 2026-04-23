import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { GoogleUser } from '../../types/GoogleUser';

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
  async validate(
    accessToken: string, 
    refreshToken: string, 
    profile: Profile, 
    done: VerifyCallback
  ): Promise<GoogleUser> {
    const { name, emails, photos, id } = profile;

    const user: GoogleUser = {
      // Ensure email exists as Google profiles may have multiple or no emails
      email: emails && emails.length > 0 ? emails[0].value : '',
      // Combine given and family names for the display string
      displayName: name ? `${name.givenName} ${name.familyName}` : '',
      photos: photos,
      id: id, // The external ID from Google
    };

    done(null, user);
    return user;
  }
}