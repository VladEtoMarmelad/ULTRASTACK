import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../../../types/User';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService, // Inject JwtService to generate access tokens
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

  /**
   * Generates a JWT access token for the authenticated user.
   */
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload), // Signs the payload to create a JWT
      user,
    };
  }

  /**
   * Generic logic to handle user data coming from different OAuth providers.
   * If the user doesn't exist, it creates a new record.
   */
  async validateOAuthUser(profile: any, provider: string) {
    const { id, email, displayName, photos } = profile;
    const avatarUrl = photos?.[0]?.value;

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