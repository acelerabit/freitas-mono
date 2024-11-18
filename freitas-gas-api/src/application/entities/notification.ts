import { Replace } from 'src/helpers/Replace';
import { randomUUID } from 'node:crypto';

export type NotificationIntervalType = 'day' | 'month' | 'week' | 'year';

export interface NotificationProps {
  message: string;
  read: boolean;
  userId: string;
  createdAt: Date;
}

export class Notification {
  private _id: string;
  private props: NotificationProps;

  constructor(
    props: Replace<NotificationProps, { createdAt?: Date; read?: boolean }>,
    id?: string,
  ) {
    this._id = id ?? randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      read: props.read ?? false,
    };
  }

  get id() {
    return this._id;
  }

  get message() {
    return this.props.message;
  }

  set message(message: string) {
    this.props.message = message;
  }

  get read() {
    return this.props.read;
  }

  set read(read: boolean) {
    this.props.read = read;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt;
  }

  get userId() {
    return this.props.userId;
  }

  set userId(userId: string) {
    this.props.userId = userId;
  }

  static create(
    props: Replace<NotificationProps, { createdAt?: Date; read?: boolean }>,
    id?: string,
  ) {
    const notification = new Notification(props, id);

    return notification;
  }
}
