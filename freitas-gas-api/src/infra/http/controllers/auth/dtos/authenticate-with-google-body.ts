import { IsNotEmpty } from 'class-validator';

export class AuthenticateUserWithGoogleBody {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  name: string;
}
