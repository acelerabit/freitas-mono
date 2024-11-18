import { Notification } from 'src/application/entities/notification';
import { Prisma, Notification as PrismaNotification } from '@prisma/client';

export class PrismaNotificationsMapper {
  static toDomain(notification: PrismaNotification) {
    return Notification.create(
      {
        message: notification.message,
        createdAt: notification.createdAt,
        read: notification.read,
        userId: notification.userId,
      },
      notification.id,
    );
  }

  static toPrisma(
    notification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id,
      message: notification.message,
      read: notification.read,
      userId: notification.userId,
      createdAt: notification.createdAt,
    };
  }
}
