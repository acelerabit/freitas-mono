import { UploadToProfile } from '@/application/use-cases/uploads/upload-to-profile';
import { Upload } from '@/infra/upload/upload';
import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload-file')
export class UploadController {
  constructor(
    private uploader: Upload,
    private uploadToProfile: UploadToProfile,
  ) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('/')
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const id = await this.uploader.uploadFilePublic(file, `files`);

      const url = await this.uploader.getPublicImageUrl(`files/${id}`);

      return {
        url,
      };
    } catch (err) {
      console.log(err);
    }
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('/:id')
  async uploadProfile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    const { url } = await this.uploadToProfile.execute({
      file,
      id,
    });

    return { url };
  }
}
