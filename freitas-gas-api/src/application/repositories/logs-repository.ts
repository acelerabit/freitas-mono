import { Log } from '../entities/log';

export abstract class LogsRepository {
  abstract fetchAll(): Promise<Log[]>;
}
