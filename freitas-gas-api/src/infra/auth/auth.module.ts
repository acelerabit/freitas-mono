import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtSecret } from 'src/common/constants';
import { JwtStrategyUser } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtSecret,

      signOptions: {
        expiresIn: '2 days',
      },
    }),
    PassportModule,
  ],

  providers: [JwtStrategyUser, JwtService],
})
export class AuthModule {}
