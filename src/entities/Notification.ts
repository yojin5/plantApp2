import { NotificationType } from '../enums/NotificationType';

export interface Notification {
  notificationId: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  scheduledFor?: Date;
}

export class NotificationEntity implements Notification {
  notificationId: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  scheduledFor?: Date;

  constructor(data: Partial<Notification>) {
    this.notificationId = data.notificationId || `notif_${Date.now()}`;
    this.userId = data.userId || '';
    this.type = data.type || NotificationType.SYSTEM_UPDATE;
    this.title = data.title || '';
    this.message = data.message || '';
    this.isRead = data.isRead || false;
    this.createdAt = data.createdAt || new Date();
    this.scheduledFor = data.scheduledFor;
  }

  markAsRead(): void {
    this.isRead = true;
  }

  toJSON(): Notification {
    return {
      notificationId: this.notificationId,
      userId: this.userId,
      type: this.type,
      title: this.title,
      message: this.message,
      isRead: this.isRead,
      createdAt: this.createdAt,
      scheduledFor: this.scheduledFor
    };
  }
}