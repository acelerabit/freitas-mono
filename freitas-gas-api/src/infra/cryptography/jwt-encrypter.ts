import { Encrypter } from '@/application/cryptography/encrypter';
import { jwtSecret } from '@/common/constants';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtEncrypter implements Encrypter {
  private EXPIRES_IN = '2 days';

  constructor(private jwtService: JwtService) {}

  encrypt(
    payload: { id: string; email: string },
    expiresIn = this.EXPIRES_IN,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: jwtSecret,
      expiresIn: expiresIn,
    });
  }

  decode(token: string): Promise<any> {
    return this.jwtService.verify(token, {
      secret: jwtSecret,
    });
  }
}
