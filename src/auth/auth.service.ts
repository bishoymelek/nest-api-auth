import { sign } from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { TokenPayload } from 'auth/dto/token-payload.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signPayload(payload: TokenPayload) {
    return sign(payload, process.env.SECRET_KEY || 'secretKey', {
      expiresIn: '12h',
    });
  }

  async validateUser(payload: TokenPayload) {
    return await this.userService.findByPayload(payload);
  }
}
