import { Log as PrismaLog } from '@prisma/client';
import { Log } from 'src/application/entities/log';

export class PrismaLogsMapper {
  static toDomain(log: PrismaLog) {
    return Log.create(
      {
        data: log.data,
      },
      log.id,
    );
  }
}
