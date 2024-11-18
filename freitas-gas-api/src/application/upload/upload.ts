export abstract class Uploader {
  abstract deleteImage(imageKey: string): Promise<void>;
  abstract getPublicImageUrl(imageKey: string): Promise<string>;
  abstract presignedURL(imageKey: string): Promise<string>;
  abstract uploadFilePublic(
    dataImage: Express.Multer.File,
    folderName?: string,
  ): Promise<string>;
  abstract uploadFile(
    dataImage: Express.Multer.File,
    folderName?: string,
  ): Promise<string>;
}
