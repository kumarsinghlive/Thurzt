import { CONFIG } from '../config';

interface RehearsalConfig {
  minLatency: number;
  maxLatency: number;
  failureRate: number; // 0 to 1
}

class RehearsalHarnessClass {
  config: RehearsalConfig = {
    minLatency: 75,
    maxLatency: 600,
    failureRate: 0, // Disabled simulated failures
  };

  private log(message: string, ...args: any[]) {
    if (CONFIG.DEBUG_REHEARSAL) {
      // console.log(`[RehearsalHarness] ${message}`, ...args);
    }
  }

  private async delay(ms?: number) {
    const latency = ms ?? (Math.random() * (this.config.maxLatency - this.config.minLatency) + this.config.minLatency);
    return new Promise(resolve => setTimeout(resolve, latency));
  }

  private shouldFail(): boolean {
    return Math.random() < this.config.failureRate;
  }

  private getFailureType(): string {
    const r = Math.random();
    if (r < 0.33) return 'timeout';
    if (r < 0.66) return '403';
    return '409';
  }

  async call<T>(name: string, fn: () => Promise<T> | T, retryCount = 0): Promise<T> {
    if (!CONFIG.REHEARSAL_MODE) {
      return fn();
    }

    this.log(`call(${name}) - Start (retry: ${retryCount})`);
    
    // Simulate latency
    await this.delay();

    // Simulate failure
    if (this.shouldFail()) {
      const failureType = this.getFailureType();
      this.log(`call(${name}) - Simulated Failure: ${failureType}`);
      
      if (failureType === 'timeout') {
        throw new Error(`[Rehearsal] Simulated Timeout for ${name}`);
      } else if (failureType === '403') {
        throw new Error(`[Rehearsal] Simulated 403 Permission Denied for ${name}`);
      } else if (failureType === '409') {
        throw new Error(`[Rehearsal] Simulated 409 Conflict for ${name}`);
      }
    }

    try {
      const result = await fn();
      
      // Simulate empty result occasionally for arrays
      if (Array.isArray(result) && result.length > 0 && Math.random() < 0.1) {
        this.log(`call(${name}) - Simulated Empty Result`);
        return [] as any;
      }

      this.log(`call(${name}) - Success`);
      return result;
    } catch (e) {
      this.log(`call(${name}) - Real Error`, e);
      throw e;
    }
  }

  listen<T>(name: string, subscribeFn: (callback: (data: T) => void) => () => void, callback: (data: T) => void): () => void {
    if (!CONFIG.REHEARSAL_MODE) {
      return subscribeFn(callback);
    }

    this.log(`listen(${name}) - Subscribed`);

    let isUnsubscribed = false;
    let eventCount = 0;

    const wrappedCallback = async (data: T) => {
      if (isUnsubscribed) return;

      eventCount++;
      const currentEvent = eventCount;

      // Simulate slow first snapshot vs fast follow-ups
      const latency = currentEvent === 1 ? this.config.maxLatency * 1.5 : this.config.minLatency;
      
      // Simulate jitter
      const jitter = Math.random() * 100 - 50;
      
      await this.delay(Math.max(0, latency + jitter));

      if (isUnsubscribed) return;

      // Simulate dropping an event occasionally (but not the first one)
      if (currentEvent > 1 && Math.random() < 0.05) {
        this.log(`listen(${name}) - Dropped event ${currentEvent}`);
        return;
      }

      this.log(`listen(${name}) - Delivered event ${currentEvent}`);
      callback(data);

      // Simulate duplicate payload occasionally
      if (Math.random() < 0.05) {
        this.log(`listen(${name}) - Sending duplicate event ${currentEvent}`);
        setTimeout(() => {
          if (!isUnsubscribed) callback(data);
        }, 50);
      }
    };

    const unsubscribe = subscribeFn(wrappedCallback);

    return () => {
      this.log(`listen(${name}) - Unsubscribed`);
      isUnsubscribed = true;
      unsubscribe();
    };
  }
}

export const RehearsalHarness = new RehearsalHarnessClass();
