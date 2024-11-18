import { Injectable } from '@nestjs/common';
import { NotificationRepository } from 'src/application/repositories/notification-repository';

interface ReadAllNotificationsRequest {
  userId: string;
}

@Injectable()
export class ReadAllNotifications {
  constructor(private notificationsRepository: NotificationRepository) {}

  async execute({ userId }: ReadAllNotificationsRequest): Promise<void> {
    await this.notificationsRepository.readAll(userId);

    return;
  }
}
