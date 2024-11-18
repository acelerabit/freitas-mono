import { Log } from '@/application/entities/log';
import { FetchAllLogs } from './fetch-all-logs';
import { InMemoryLogsRepository } from 'test/repositories/logs/in-memory-logs-repository';

let inMemoryLogsRepository: InMemoryLogsRepository;
let fetchAllLogs: FetchAllLogs;

describe('Fetch all logs', () => {
  beforeEach(() => {
    inMemoryLogsRepository = new InMemoryLogsRepository();
    fetchAllLogs = new FetchAllLogs(inMemoryLogsRepository);
  });

  it('should be able to fetch all logs', async () => {
    const log = Log.create({
      data: {
        teste: 'hello',
      },
      createdAt: new Date(),
    });

    inMemoryLogsRepository.logs.push(log);

    const { logs } = await fetchAllLogs.execute();

    expect(logs).toHaveLength(1);
    expect(inMemoryLogsRepository.logs[0]).toEqual(logs[0]);
  });
});
