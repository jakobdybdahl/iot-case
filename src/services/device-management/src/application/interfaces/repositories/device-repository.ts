import { Repository } from './base-repository';
import { Device } from '../../../domain/entites/device';

export type DeviceRepository = Repository<Device> & {
  updateConnectionStatus(
    id: string,
    connectionStatus: 'connected' | 'disconnected',
  ): Promise<Device>;
};
