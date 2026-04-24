import { Injectable } from '@nestjs/common';
import { ServerMetrics } from '../../types/ServerMetrics';
import { NotificationPayload } from '../../types/NotificationPayload';

@Injectable()
export class WebsocketService {
  // Generates randomized system performance data for demonstration
  getServerMetrics(): ServerMetrics {
    return {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      timestamp: new Date().toISOString(),
    };
  }

  // Wraps raw messages into a structured notification payload
  prepareNotification(message: string, type: string = 'INFO'): NotificationPayload {
    return {
      type,
      message,
      timestamp: new Date().toISOString(),
    };
  }
}