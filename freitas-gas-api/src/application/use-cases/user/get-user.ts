import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../../repositories/user-repository';
import { User } from './../../entities/user';

interface UserRequest {
  id: string;
}

interface UserResponse {
  user: User;
}

@Injectable()
export class GetUser {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id }: UserRequest): Promise<UserResponse> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new BadRequestException('Não foi possivel buscar o usuário', {
        cause: new Error('Usuário não encontrado'),
        description: 'Usuário não encontrado',
      });
    }

    return { user };
  }
}
