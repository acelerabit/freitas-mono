import { Log } from './../../../src/application/entities/log';
import { LogsRepository } from 'src/application/repositories/logs-repository';

export class InMemoryLogsRepository implements LogsRepository {
  public logs: Log[] = [];

  async fetchAll(): Promise<Log[]> {
    return this.logs;
  }
}
