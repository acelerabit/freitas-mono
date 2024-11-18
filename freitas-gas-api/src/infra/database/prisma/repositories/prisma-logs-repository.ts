import { Injectable } from '@nestjs/common';
import { Log } from 'src/application/entities/log';
import { LogsRepository } from 'src/application/repositories/logs-repository';
import { PrismaLogsMapper } from '../mappers/logs.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaLogsRepository implements LogsRepository {
  constructor(private prismaService: PrismaService) {}

  async fetchAll(): Promise<Log[]> {
    const raw = await this.prismaService.log.findMany();

    if (!raw) {
      return null;
    }

    return raw.map((log) => PrismaLogsMapper.toDomain(log));
  }
}
