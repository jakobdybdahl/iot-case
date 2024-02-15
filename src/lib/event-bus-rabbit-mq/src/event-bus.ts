import { EventBus, EventType, IntegrationEvent } from '@dybdahl-iot/event-bus';
import * as amqp from 'amqplib';

const EXCHANGE_NAME = 'dybdahl-iot-events';

type Subscription<T extends EventType> = (
  event: IntegrationEvent & { type: T },
) => void | Promise<void>;

type EventBusOptions = {
  clientName: string;
  subscriptions?: {
    [Type in EventType]?: Subscription<Type>;
  };
  exchange?: string;
};

export class RabbitMQEventBus implements EventBus {
  private channel: amqp.Channel;

  public constructor(private readonly options: EventBusOptions) {}

  public publish(event: IntegrationEvent) {
    this.channel.publish(
      EXCHANGE_NAME,
      event.type,
      Buffer.from(JSON.stringify(event)),
    );
  }

  public async start(): Promise<void> {
    const conn = await this.connect();

    this.channel = await conn.createChannel();

    this.channel.assertExchange(
      this.options.exchange ?? EXCHANGE_NAME,
      'direct',
      { durable: false },
    );

    await this.channel.assertQueue(this.options.clientName, {
      exclusive: false,
    });

    if (this.options.subscriptions) {
      for (const eventType of Object.keys(this.options.subscriptions)) {
        await this.channel.bindQueue(
          this.options.clientName,
          EXCHANGE_NAME,
          eventType,
        );
      }

      this.channel.consume(this.options.clientName, async (msg) => {
        if (msg !== null) {
          const cb =
            this.options.subscriptions![msg.fields.routingKey as EventType];

          if (cb !== undefined) {
            const event: IntegrationEvent = JSON.parse(msg.content.toString());
            await cb(event as any);
          }

          this.channel.ack(msg);
        }
      });
    }
  }

  private async connect(): Promise<amqp.Connection> {
    const retryCount = 5;

    for (let i = 0; i < retryCount; i++) {
      try {
        return await amqp.connect({
          hostname: 'rabbitmq',
        });
      } catch (err) {
        console.error('Failed to connect to RabbitMQ', err);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    throw new Error('Failed to connect to RabbitMQ after 5 retries');
  }
}
