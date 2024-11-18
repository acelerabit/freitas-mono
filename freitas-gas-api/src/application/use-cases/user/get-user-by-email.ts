import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../../repositories/user-repository';
import { User } from './../../entities/user';

interface UserRequest {
  email: string;
}

interface UserResponse {
  user: User;
}

@Injectable()
export class GetUserByEmail {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email }: UserRequest): Promise<UserResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Não foi possivel buscar o usuário', {
        cause: new Error('Usuário não encontrado'),
        description: 'Usuário não encontrado',
      });
    }

    return { user };
  }
}
