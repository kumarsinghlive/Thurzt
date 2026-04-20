import { CONFIG } from '../config';

export type PushEventType = 
  | 'NEW_MATCH' 
  | 'NEW_MESSAGE' 
  | 'INSTANT_MESSAGE_RECEIVED' 
  | 'PRIVATE_PHOTO_REQUESTED' 
  | 'PRIVATE_PHOTO_APPROVED' 
  | 'PRIVATE_PHOTO_REVOKED';

export interface PushService {
  notify(eventType: PushEventType, payload: any): void;
  getLogs(): { eventType: PushEventType, payload: any, timestamp: number }[];
  clearLogs(): void;
  registerDeviceToken(userId: string): Promise<void>;
}

class MockPushServiceImpl implements PushService {
  private logs: { eventType: PushEventType, payload: any, timestamp: number }[] = [];

  notify(eventType: PushEventType, payload: any): void {
    const logEntry = { eventType, payload, timestamp: Date.now() };
    this.logs.unshift(logEntry);
    // console.log(`[PushService] ${eventType}:`, payload);
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  async registerDeviceToken(userId: string): Promise<void> {
    // console.log(`[PushService] Mock mode: Registering device token for ${userId}`);
  }
}

export const pushService: PushService = new MockPushServiceImpl();
