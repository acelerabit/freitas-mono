import { HashCompare } from '@/application/cryptography/hash-comparer';
import { HashGenerator } from '@/application/cryptography/hash-generator';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from 'src/application/repositories/user-repository';

export interface UpdateUserPasswordRequest {
  id: string;
  oldPassword: string;
  newPassword: string;
}

@Injectable()
export class UpdateUserPassword {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
    private hashCompare: HashCompare,
  ) {}

  async execute({
    id,
    oldPassword,
    newPassword,
  }: UpdateUserPasswordRequest): Promise<void> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new BadRequestException('Não foi possivel editar o usuário', {
        cause: new Error('Usuário não encontrado'),
        description: 'Usuário não encontrado',
      });
    }

    const passwordMatch = await this.hashCompare.compare(
      oldPassword,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('A senha atual está incorreta');
    }

    const passwordHashed = await this.hashGenerator.hash(newPassword);

    user.password = passwordHashed;

    await this.usersRepository.update(user);

    return;
  }
}
