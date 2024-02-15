import { MosquittoBroker } from '@dybdahl-iot/mqtt-mosquitto';
import { ApplicationContainer } from '../dependency-injection/app-container';
import { DeviceConnectionChangeHandler } from '../../application/handlers/device-connection-change-event';
import { z } from 'zod';

export const configIotListeners = (
  appContainer: ApplicationContainer,
): Promise<void> => {
  const iotBroker = new MosquittoBroker({
    host: 'mqtt',
    port: 1883,
    clientId: 'device-management',
  });

  iotBroker.subscribe('device/+/connection-status', async (topic, message) => {
    const msgSchema = z.object({
      status: z.enum(['connected', 'disconnected']),
    });

    const parsedMsg = msgSchema.safeParse(message);

    if (!parsedMsg.success) {
      return;
    }

    const handler = appContainer.build(DeviceConnectionChangeHandler);

    await handler.handle({
      id: topic.split('/')[1],
      connectionStatus: parsedMsg.data.status,
    });
  });

  return iotBroker.start();
};
