import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from '../google.strategy';
import { GithubStrategy } from '../github.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    GoogleStrategy, // Register Google strategy
    GithubStrategy,  // Register GitHub strategy
  ],
})
export class AuthModule {}