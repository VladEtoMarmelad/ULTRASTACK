import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '@sharedTypes/User';
import { JwtService } from '@nestjs/jwt';
import { OAuthProfile } from '../../../types/OAuthProfile';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: Partial<User>) {
    const existingUser = this.usersService.findByEmail(dto.email ?? "");
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, this.SALT_ROUNDS);
    }

    return this.usersService.create({
      ...dto,
      provider: 'local',
    });
  }

  // Generates both access and refresh tokens for the user
  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    const secret = process.env.JWT_SECRET || 'secretKey';
    
    // Sign tokens with explicit secret to ensure consistency
    const access_token = this.jwtService.sign(payload, { 
      expiresIn: '15m',
      secret: secret 
    });
    const refresh_token = this.jwtService.sign(payload, { 
      expiresIn: '7d',
      secret: secret 
    });
    
    return {
      access_token,
      refresh_token,
      user,
    };
  }

  // Validates a refresh token and returns a new access token
  async refresh(refreshToken: string) {
    try {
      // Verify the token using the same secret key
      const secret = process.env.JWT_SECRET || 'secretKey';
      
      const payload = this.jwtService.verify(refreshToken, {
        secret: secret,
      });
      
      const user = this.usersService.findOne(payload.sub);
      const newPayload = { email: user.email, sub: user.id };
      
      const newAccessToken = this.jwtService.sign(newPayload);
      
      return {
        access_token: newAccessToken,
      };
    } catch (e) {
      console.error('✗ Refresh token validation failed:', (e as Error).message);
      // Throws 401 if the token is malformed, expired, or secret mismatches
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async validateOAuthUser(profile: OAuthProfile, provider: string): Promise<User> {
    const { id, email, displayName, photos } = profile;
    const avatarUrl = Array.isArray(photos) ? photos[0]?.value : photos;

    let user = this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.create({
        email,
        name: displayName,
        provider,
        externalId: id,
        avatarUrl,
      });
    } else if (!user.externalId) {
      user = await this.usersService.update(user.id, {
        provider,
        externalId: id,
        avatarUrl: user.avatarUrl || avatarUrl,
      });
    }

    return user;
  }
}