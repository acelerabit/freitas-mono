import { Module } from '@nestjs/common';
import { BcryptHasher } from './bcrypt-hasher';

import { JwtService } from '@nestjs/jwt';
import { Encrypter } from '@/application/cryptography/encrypter';
import { JwtEncrypter } from './jwt-encrypter';
import { HashCompare } from '@/application/cryptography/hash-comparer';
import { HashGenerator } from '@/application/cryptography/hash-generator';

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashCompare, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
    JwtService,
  ],
  exports: [HashGenerator, HashCompare, Encrypter],
})
export class CryptographyModule {}
