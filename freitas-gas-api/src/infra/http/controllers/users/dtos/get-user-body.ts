import { IsNotEmpty } from 'class-validator';

export class GetUserBody {
  @IsNotEmpty()
  id: string;
}
