import { HashGenerator } from '@/application/cryptography/hash-generator';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../../repositories/user-repository';
import { User } from './../../entities/user';
import { Upload } from '@/infra/upload/upload';

interface UploadToProfileRequest {
  file: Express.Multer.File;
  id: string;
}

interface UploadToProfileResponse {
  url: string;
}

@Injectable()
export class UploadToProfile {
  constructor(
    private usersRepository: UsersRepository,
    private uploader: Upload,
  ) {}

  async execute(
    request: UploadToProfileRequest,
  ): Promise<UploadToProfileResponse> {
    const { file, id } = request;

    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new BadRequestException(`Usuário não existe`, {
        cause: new Error(`Usuário não existe`),
        description: `Usuário não existe`,
      });
    }

    try {
      const id = await this.uploader.uploadFilePublic(file, `files`);

      const url = await this.uploader.getPublicImageUrl(`files/${id}`);

      user.avatarUrl = url;

      await this.usersRepository.update(user);

      return { url };
    } catch (err) {
      throw new BadRequestException(`Não foi possivel fazer o upload`, {
        cause: new Error(`Não foi possivel fazer o upload`),
        description: `Não foi possivel fazer o upload`,
      });
    }
  }
}
