import { Notification } from '../entities/Notification';
import { NotificationEntity } from '../entities/Notification';
import { StorageService } from '../services/StorageService';
import { STORAGE_KEYS } from '../utils/constants';

export class NotificationRepository {
  private storageService: StorageService;

  constructor() {
    this.storageService = StorageService.getInstance();
  }

  async save(notification: NotificationEntity): Promise<Notification> {
    const notifications = await this.findAll();
    const index = notifications.findIndex(n => n.notificationId === notification.notificationId);
    
    if (index >= 0) {
      notifications[index] = notification.toJSON();
    } else {
      notifications.unshift(notification.toJSON());
    }
    
    await this.storageService.save(STORAGE_KEYS.NOTIFICATIONS, notifications);
    return notification.toJSON();
  }

  async findById(notificationId: string): Promise<Notification | null> {
    const notifications = await this.findAll();
    return notifications.find(n => n.notificationId === notificationId) || null;
  }

  async findByUser(userId: string): Promise<Notification[]> {
    const notifications = await this.findAll();
    return notifications.filter(n => n.userId === userId);
  }

  async findUnread(userId: string): Promise<Notification[]> {
    const notifications = await this.findByUser(userId);
    return notifications.filter(n => !n.isRead);
  }

  async findAll(): Promise<Notification[]> {
    const notifications = await this.storageService.get<Notification[]>(STORAGE_KEYS.NOTIFICATIONS);
    return notifications || [];
  }

  async delete(notificationId: string): Promise<void> {
    const notifications = await this.findAll();
    const filtered = notifications.filter(n => n.notificationId !== notificationId);
    await this.storageService.save(STORAGE_KEYS.NOTIFICATIONS, filtered);
  }

  async clearAll(userId: string): Promise<void> {
    const notifications = await this.findAll();
    const filtered = notifications.filter(n => n.userId !== userId);
    await this.storageService.save(STORAGE_KEYS.NOTIFICATIONS, filtered);
  }
}