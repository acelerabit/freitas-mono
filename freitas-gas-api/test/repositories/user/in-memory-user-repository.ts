import { PaginationParams } from '@/@shared/pagination-interface';
import { User } from './../../../src/application/entities/user';
import { UsersRepository } from 'src/application/repositories/user-repository';

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = [];

  async create(user: User) {
    this.users.push(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email);
  }

  async findById(id: string): Promise<User> {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      return null;
    }

    return user;
  }

  async findAll(pagination: PaginationParams): Promise<User[]> {
    return this.users
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(
        (pagination.page - 1) * pagination.itemsPerPage,
        pagination.page * pagination.itemsPerPage,
      );
  }

  async update(user: User): Promise<void> {
    const userFound = this.users.findIndex(
      (userItem) => userItem.email === user.email,
    );

    this.users[userFound] = user;

    return;
  }

  async findAllWithoutPaginate(): Promise<User[]> {
    return this.users;
  }

  async count(): Promise<number> {
    return this.users.length;
  }
}
