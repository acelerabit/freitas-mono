import { UsersMetrics } from '@/application/use-cases/dashboard/users-metrics';
import { Controller, Get } from '@nestjs/common';

@Controller('dashboard')
export class DashboardController {
  constructor(private usersMetrics: UsersMetrics) {}

  @Get('/users/metrics')
  async users() {
    const { data, total } = await this.usersMetrics.execute();

    return {
      data: data.map((user) => {
        return {
          id: user.id,
          createdAt: user.createdAt,
        };
      }),
      total,
    };
  }
}
