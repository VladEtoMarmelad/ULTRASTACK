import { Profile } from 'passport-google-oauth20';

// Structure of the user object processed by the application after Google authentication
export interface GoogleUser {
  email: string;
  displayName: string;
  photos: Profile['photos'];
  id: string;
}