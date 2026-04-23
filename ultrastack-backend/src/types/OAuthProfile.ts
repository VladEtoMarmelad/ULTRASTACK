// Structure of user profile data received from OAuth strategies
export interface OAuthProfile {
  id: string;
  email: string;
  displayName: string;
  photos?: string | { value: string }[];
}