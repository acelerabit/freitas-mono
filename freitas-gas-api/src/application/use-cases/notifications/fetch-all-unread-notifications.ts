import { PaginationParams } from '@/@shared/pagination-interface';
import { Injectable } from '@nestjs/common';
import { Notification } from 'src/application/entities/notification';
import { NotificationRepository } from 'src/application/repositories/notification-repository';

interface FetchAllUnreadNotificationsRequest {
  userId: string;
  pagination: PaginationParams
}

interface FetchAllUnreadNotificationsResponse {
  notifications: Notification[];
}

@Injectable()
export class FetchAllUnreadNotifications {
  constructor(private notificationsRepository: NotificationRepository) {}

  async execute({
    userId,
    pagination
  }: FetchAllUnreadNotificationsRequest): Promise<FetchAllUnreadNotificationsResponse> {
    const notifications = await this.notificationsRepository.fetchAllUnread(
      userId,
      pagination
    );

    return { notifications };
  }
}
