import { Encrypter } from '@/application/cryptography/encrypter';
import { HashGenerator } from '@/application/cryptography/hash-generator';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/application/repositories/user-repository';

export interface UpdatePasswordRequest {
  token: string;
  newPassword: string;
}

@Injectable()
export class UpdatePassword {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
    private encrypter: Encrypter,
  ) {}

  async execute({ token, newPassword }: UpdatePasswordRequest): Promise<void> {
    const userEmail = await this.verifyResetToken(token);

    const userFound = await this.usersRepository.findByEmail(userEmail);

    if (!userFound) {
      throw new BadRequestException('Não foi possivel encontrar o usuário', {
        cause: new Error('Usuário não encontrado'),
        description: 'Usuário não encontrado',
      });
    }

    userFound.password = await this.hashGenerator.hash(newPassword);

    await this.usersRepository.update(userFound);
  }

  async verifyResetToken(token: string): Promise<string> {
    try {
      const decoded = await this.encrypter.decode(token);

      if (decoded && decoded.email) {
        const expirationDate = new Date(decoded.exp * 1000);

        if (expirationDate < new Date()) {
          throw new BadRequestException('Esse token está expirado.', {
            cause: new Error('Esse token está expirado.'),
            description: 'Esse token está expirado.',
          });
        }

        return decoded.email;
      }
      throw new BadRequestException('Esse token é inválido ou está expirado.', {
        cause: new Error('Esse token é inválido ou está expirado.'),
        description: 'Esse token é inválido ou está expirado.',
      });
    } catch (error) {
      throw new BadRequestException('Token  inválido', {
        cause: new Error('Esse token é inválido ou está expirado.'),
        description: 'Esse token é inválido ou está expirado.',
      });
    }
  }
}
