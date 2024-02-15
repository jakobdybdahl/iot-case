import { Logger } from '../interfaces/logger';
import { EventBus, IntegrationEvent } from '@dybdahl-iot/event-bus';
import { DeviceRepository } from '../interfaces/repositories/device-repository';

export type DeviceConnectionChange = {
  id: string;
  connectionStatus: 'connected' | 'disconnected';
};

export class DeviceConnectionChangeHandler {
  public constructor(
    private readonly logger: Logger,
    private readonly eventBus: EventBus,
    private readonly deviceRepository: DeviceRepository,
  ) {}

  public async handle(event: DeviceConnectionChange): Promise<void> {
    this.logger.debug(
      `Updating device connection status: ${event.id} ${event.connectionStatus}`,
      {
        deviceId: event.id,
        connectionStatus: event.connectionStatus,
      },
    );

    const device = await this.deviceRepository.updateConnectionStatus(
      event.id,
      event.connectionStatus,
    );

    this.eventBus.publish({
      type: 'device-connection-change',
      status: device.connectionStatus,
      statusUpdatedAt: device.connectionStatusUpdatedAt,
      deviceId: device.id,
    });

    this.logger.info('Device connection status updated', {
      id: event.id,
      connectionStatus: event.connectionStatus,
    });
  }
}
