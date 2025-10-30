import * as Notifications from 'expo-notifications';
import { NotificationType } from '../enums/NotificationType';

export class NotificationService {
  private static instance: NotificationService;

  private constructor() {
    this.configure();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private configure() {
  Notifications.setNotificationHandler({
    handleNotification: async () => {
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      } as Notifications.NotificationBehavior;
    },
  });
}

  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  async scheduleNotification(
  title: string,
  body: string,
  date: Date,
  type: NotificationType = NotificationType.SYSTEM_UPDATE
): Promise<string> {
  const trigger: Notifications.DateTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DATE,
    date: date,
  };

  return await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { type },
    },
    trigger,
  });
}

  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async sendImmediateNotification(title: string, body: string): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: null,
    });
  }

  async scheduleWateringReminder(plantName: string, date: Date): Promise<string> {
    return await this.scheduleNotification(
      '💧 Time to Water!',
      `Your ${plantName} needs watering today`,
      date,
      NotificationType.WATERING_REMINDER
    );
  }

  async notifyHelpRequest(requesterName: string): Promise<void> {
    await this.sendImmediateNotification(
      '🤝 New Help Request',
      `${requesterName} needs help watering their plants!`
    );
  }

  async notifyHelpResponse(helperName: string): Promise<void> {
    await this.sendImmediateNotification(
      '✅ Help Offer Received',
      `${helperName} offered to help with your plants!`
    );
  }
}