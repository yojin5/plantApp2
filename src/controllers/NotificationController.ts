import { NotificationEntity } from '../entities/Notification';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { NotificationService } from '../services/NotificationService';
import { NotificationType } from '../enums/NotificationType';

export class NotificationController {
  private notificationRepository: NotificationRepository;
  private notificationService: NotificationService;

  constructor() {
    this.notificationRepository = new NotificationRepository();
    this.notificationService = NotificationService.getInstance();
  }

  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string
  ): Promise<void> {
    try {
      const notification = new NotificationEntity({
        userId,
        type,
        title,
        message
      });

      await this.notificationRepository.save(notification);
      await this.notificationService.sendImmediateNotification(title, message);
    } catch (error) {
      console.error('Create notification error:', error);
    }
  }

  async getUserNotifications(userId: string): Promise<any[]> {
    return await this.notificationRepository.findByUser(userId);
  }

  async getUnreadCount(userId: string): Promise<number> {
    const unread = await this.notificationRepository.findUnread(userId);
    return unread.length;
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      const notification = await this.notificationRepository.findById(notificationId);
      if (notification) {
        const notificationEntity = new NotificationEntity(notification);
        notificationEntity.markAsRead();
        await this.notificationRepository.save(notificationEntity);
      }
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  }

  async clearAll(userId: string): Promise<void> {
    await this.notificationRepository.clearAll(userId);
  }
}