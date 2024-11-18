import { Encrypter } from '@/application/cryptography/encrypter';

export class FakeEncrypter implements Encrypter {
  async decode(token: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload);
  }
}
