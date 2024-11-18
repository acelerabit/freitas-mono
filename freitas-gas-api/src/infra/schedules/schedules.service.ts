import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout, SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  // Método para executar uma tarefa a cada minuto
  // @Interval(60 * 1000) // a cada 1 minuto
  // handleInterval() {
  //   this.logger.debug('Executing task every minute');
  // }

  // Método para executar uma tarefa no cron especificado
  // @Cron('0 * * * * *')
  // handleCron() {
  //   this.logger.debug('Executing task every hour');
  // }

  // Método para executar uma tarefa após um intervalo de tempo especificado
  // @Timeout(5000)
  // handleTimeout() {
  //   this.logger.debug('Executing task after 5 seconds');
  // }
}
