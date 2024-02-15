import { EventBus, IntegrationEvent } from '@dybdahl-iot/event-bus';

export class SNSEventBus implements EventBus {
  public publish(event: IntegrationEvent): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
