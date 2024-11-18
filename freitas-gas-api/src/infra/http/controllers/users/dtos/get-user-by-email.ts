import { IsNotEmpty } from 'class-validator';

export class GetUserByEmailBody {
  @IsNotEmpty()
  email: string;
}
