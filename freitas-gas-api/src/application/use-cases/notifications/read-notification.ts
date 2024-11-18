import { BadRequestException, Injectable } from '@nestjs/common';
import { NotificationRepository } from 'src/application/repositories/notification-repository';

interface ReadNotificationRequest {
  id: string;
}

@Injectable()
export class ReadNotification {
  constructor(private notificationsRepository: NotificationRepository) {}

  async execute({ id }: ReadNotificationRequest): Promise<void> {
    const notification = await this.notificationsRepository.findById(id);

    if (!notification) {
      throw new BadRequestException(
        'Não foi possivel encontrar essa notificação',
        {
          cause: new Error('Notificação não encontrado'),
          description: 'Notificação não encontrado',
        },
      );
    }

    await this.notificationsRepository.read(notification.id);

    return;
  }
}
