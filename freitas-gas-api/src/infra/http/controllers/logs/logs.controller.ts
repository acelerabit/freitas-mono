import { Controller, Get } from '@nestjs/common';
import { FetchAllLogs } from 'src/application/use-cases/logs/fetch-all-logs';
import { LogsPresenters } from './presenters/log.presenters';

@Controller('logs')
export class LogsController {
  constructor(private fetchAllLogs: FetchAllLogs) {}

  @Get('/')
  async fetchAll(): Promise<any> {
    const { logs } = await this.fetchAllLogs.execute();

    return {
      logs: logs.map(LogsPresenters.toHTTP),
    };
  }
}
