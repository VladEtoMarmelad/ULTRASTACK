import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly secret: string;

  constructor() {
    // Define the secret in a local variable before super() to avoid 'this' access errors
    const jwtSecret = process.env.JWT_SECRET || "secretKey";
    
    super({
      // Crucial: This must match the way frontend sends the header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
    
    // Now 'this' is available after super() has been called
    this.secret = jwtSecret;
  }

  async validate(payload: { sub: number; email: string }) {
    // Returns the payload object which becomes available as request.user
    return { sub: payload.sub, email: payload.email };
  }
}