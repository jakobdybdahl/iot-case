export type DeviceConnectionChangeEvent = {
  type: "device-connection-change";
  deviceId: string;
  status: "connected" | "disconnected";
  statusUpdatedAt: number;
};
