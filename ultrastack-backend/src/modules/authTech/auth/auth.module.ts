import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from '../google.strategy';
import { GithubStrategy } from '../github.strategy';
import { JwtStrategy } from '../jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    // Initialize PassportModule with the default strategy
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      // Ensure this secret is consistently available to all components
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '15m' },
    }),
    UsersModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    GoogleStrategy, 
    GithubStrategy,
    JwtStrategy,
  ],
  exports: [AuthService]
})
export class AuthModule {}