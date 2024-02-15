import * as mqtt from 'mqtt';

type Options = {
  clientId: string;
  host: string;
  port: number;
};

const sub2regex = (topic) => {
  return new RegExp(`^${topic}\$`
      .replaceAll('+', '[^/]*')
      .replace('/#', '(|/.*)')
  )
};

export class MosquittoBroker {
  private client: mqtt.MqttClient;

  private connected = false;
  
  private subscriptions: { [topic: string]: ((topic: string, message: unknown) => Promise<void>)[] } = {};

  public constructor(private readonly options: Options) {}

  public async start(): Promise<void> {
    console.log('Connecting to broker...')
    this.client = await this.connect();
    console.log('Connected to broker');

    this.connected = true;

    Object.keys(this.subscriptions).forEach(async (topic) => {
      await this.client.subscribeAsync(topic, {
        properties: {
          subscriptionIdentifier: 1
        }
      });
    });

    this.client.on('message', async (topic, message, packet) => {
      const parsedMessage = JSON.parse(message.toString());

      const matches = Object.keys(this.subscriptions).filter((sub) => sub2regex(sub).test(topic));
      
      matches.forEach(async (match) => {
        this.subscriptions[match].forEach(async (cb) => await cb(topic, parsedMessage));
      });
    });
  }

  public async subscribe(topic: string, cb: (topic: string, message: unknown) => Promise<void>): Promise<void> {
    if (!this.subscriptions[topic]) {
      this.subscriptions[topic] = [];
    }

    this.subscriptions[topic].push(cb);
  }

  public async publish(topic: string, message: unknown): Promise<void> {
    if (!this.connected) {
      throw new Error('Not connected to broker');
    }

    this.client.publish(topic, JSON.stringify(message));
  }

  private async connect(): Promise<mqtt.MqttClient> {
    const retryCount = 5;

    for (let i = 0; i < retryCount; i++) {
      try {
        return await mqtt.connectAsync(`mqtt://${this.options.host}:${this.options.port}`, {
          clientId: this.options.clientId,
          username: '',
          password: '',
          reconnectPeriod: 1000,
          connectTimeout: 4000
        });
      } catch (err) {
        console.error('Failed to connect to Mosquitto', err);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    throw new Error('Failed to connect to Mosquitto after 5 retries');
  }
}