import { Response } from 'express';
import { RealtimeEvent } from '../src/types';

class EventBus {
  private clients: Set<Response> = new Set();
  private recentEvents: RealtimeEvent[] = [];

  addClient(res: Response) {
    this.clients.add(res);
  }

  removeClient(res: Response) {
    this.clients.delete(res);
  }

  emitEvent(event: RealtimeEvent) {
    this.recentEvents.unshift(event);
    if (this.recentEvents.length > 50) {
      this.recentEvents.pop();
    }

    const payload = `data: ${JSON.stringify(event)}\n\n`;
    for (const client of this.clients) {
      try {
        client.write(payload);
      } catch (err) {
        this.clients.delete(client);
      }
    }
  }

  getRecentEvents(): RealtimeEvent[] {
    return this.recentEvents;
  }
}

export const eventBus = new EventBus();
