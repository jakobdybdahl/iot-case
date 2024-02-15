export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  offset: number;
  limit: number;
};

type DeviceResponse = {
  id: string;
  connectionStatus: 'connected' | 'disconnected';
  connectionStatusUpdatedAt: string;
  createdAt: string;
};

export type DeviceListResponse = PaginatedResponse<DeviceResponse>;
