import { Notification } from '@/application/entities/notification';

export class NotificationPresenter {
  static toHTTP(notification: Notification) {
    return {
      id: notification.id,
      message: notification.message,
      read: notification.read,
      createdAt: notification.createdAt,
    };
  }
}
