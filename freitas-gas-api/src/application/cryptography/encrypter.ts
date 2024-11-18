export abstract class Encrypter {
  abstract encrypt(
    payload: Record<string, unknown>,
    expiresIn?: string,
  ): Promise<string>;
  abstract decode(token: string): Promise<any>;
}
