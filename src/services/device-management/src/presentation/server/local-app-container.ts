import { asClass, asValue } from 'awilix';
import {
  ApplicationContainer,
  BaseApplicationContainer,
} from '../dependency-injection/app-container';
import { EnvvarSecretManager } from './local-mocks/local-secret-manager';
import { registerMongoDb } from '../dependency-injection/mongo';
import { RabbitMQEventBus } from '@dybdahl-iot/event-bus-rabbit-mq';
import { Logger } from '../../application/interfaces/logger';
import { Device } from '../../domain/entites/device';
import { Db } from 'mongodb';

export class LocalApplicationContainer extends BaseApplicationContainer {
  public constructor() {
    super();
  }

  public static async init(): Promise<ApplicationContainer> {
    const container = super.initSync();

    // override registered values
    container.register({
      secretManager: asClass(EnvvarSecretManager, { lifetime: 'SINGLETON' }),
    });

    // async registrations only (same as in ApplicationContainer)
    await registerMongoDb(container);
    await registerRabbitMQEventBus(container);

    await seedDb(container);

    return container;
  }
}

const registerRabbitMQEventBus = async (
  container: ApplicationContainer,
): Promise<void> => {
  const logger = container.resolve<Logger>('logger');

  const eventBus = new RabbitMQEventBus({
    clientName: 'device-management',
    subscriptions: {
      'device-connection-change': async (event) => {
        // TODO build handler using app container
        // TODO publish to connected WebSocket clients
        logger.info('Received device-connection-change event', event);
      },
    },
  });

  await eventBus.start();

  container.register({
    eventBus: asValue(eventBus),
  });
};

const seedDb = async (container: ApplicationContainer): Promise<void> => {
  const mongoDb = container.resolve<Db>('mongoDb');
  const collection = mongoDb.collection<Device>('devices');

  const device = await collection.findOne({ id: 'test-device' });

  if (device) {
    return;
  }

  await collection.insertOne({
    id: 'test-device',
    connectionStatus: 'disconnected',
    connectionStatusUpdatedAt: Date.now(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
};
