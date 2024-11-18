import { Injectable } from '@nestjs/common';
import { Log } from 'src/application/entities/log';
import { LogsRepository } from 'src/application/repositories/logs-repository';

interface FetchAllLogsResponse {
  logs: Log[];
}

@Injectable()
export class FetchAllLogs {
  constructor(private logsRepository: LogsRepository) {}

  async execute(): Promise<FetchAllLogsResponse> {
    const logs = await this.logsRepository.fetchAll();

    return { logs };
  }
}
