import { Log } from 'src/application/entities/log';

export class LogsPresenters {
  static toHTTP(log: Log) {
    return {
      id: log.id,
      data: log.data,
    };
  }
}
