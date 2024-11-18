import { Injectable } from '@nestjs/common';
import { User } from 'src/application/entities/user';
import { UsersRepository } from 'src/application/repositories/user-repository';

export interface UsersMetricsResponse {
  data: User[];
  total: number;
}

@Injectable()
export class UsersMetrics {
  constructor(private userRepository: UsersRepository) {}

  async execute(): Promise<UsersMetricsResponse> {
    const usersCount = await this.userRepository.count();

    const users = await this.userRepository.findAllWithoutPaginate();

    return {
      data: users,
      total: usersCount,
    };
  }
}
