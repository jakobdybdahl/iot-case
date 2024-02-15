import { Db } from 'mongodb';
import { Device } from '../../../domain/entites/device';
import { DeviceRepository } from '../../../application/interfaces/repositories/device-repository';
import { MongoRepository } from './mongo-repository';

export class MongoDeviceRepository
  extends MongoRepository<Device>
  implements DeviceRepository
{
  public constructor(mongoDb: Db) {
    super(mongoDb, 'devices');
  }

  public async updateConnectionStatus(
    id: string,
    connectionStatus: 'connected' | 'disconnected',
  ): Promise<Device> {
    const updateResult = await this.collection.findOneAndUpdate(
      { id: id },
      {
        $set: {
          connectionStatus: connectionStatus,
          connectionStatusUpdatedAt: Date.now(),
        },
      },
      {
        upsert: false,
        returnDocument: 'after',
      },
    );

    if (!updateResult.ok) {
      throw new Error('Failed to update device');
    }

    if (!updateResult.value) {
      throw new Error('Device not found');
    }

    return updateResult.value;
  }
}
