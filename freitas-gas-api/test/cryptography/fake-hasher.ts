import { HashCompare } from '@/application/cryptography/hash-comparer';
import { HashGenerator } from '@/application/cryptography/hash-generator';

export class FakeHasher implements HashGenerator, HashCompare {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed');
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash;
  }
}
