import { DeviceRepository } from '../interfaces/repositories/device-repository';

export type GetDevicesRequest = {
  limit: number;
  offset: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  limit: number;
  offset: number;
};

export type DeviceResponse = {
  id: string;
  connectionStatus: 'connected' | 'disconnected';
  connectionStatusUpdatedAt: string;
  createdAt: string;
};

export type GetDevicesResponse = PaginatedResponse<DeviceResponse>;

export class GetDevicesHandler {
  public constructor(private readonly deviceRepository: DeviceRepository) {}

  public async handle(req: GetDevicesRequest): Promise<GetDevicesResponse> {
    const total = await this.deviceRepository.count();

    const devices = await this.deviceRepository.find({
      limit: req.limit,
      offset: req.offset,
    });

    return {
      items: devices.map((d) => ({
        id: d.id,
        connectionStatus: d.connectionStatus,
        connectionStatusUpdatedAt: new Date(
          d.connectionStatusUpdatedAt,
        ).toISOString(),
        createdAt: new Date(d.createdAt).toISOString(),
      })),
      total,
      limit: req.limit,
      offset: req.offset,
    };
  }
}
