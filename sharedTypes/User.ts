export interface User {
  id: number;
  email: string;
  name: string;
  /**
   * Hashed password for credentials-based authentication. 
   * Optional because OAuth users might not have a password set.
   */
  password?: string;
  // Indicates the authentication source (e.g., 'local', 'google', 'github')
  provider?: string;
  // Unique identifier from the external OAuth provider (e.g., Google Sub ID)
  externalId?: string;
  // URL to the user's avatar provided by OAuth services
  avatarUrl?: string;
  // Metadata for tracking account creation and updates
  createdAt?: Date;
  updatedAt?: Date;
}