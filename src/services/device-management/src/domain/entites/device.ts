import { Entity } from '../base-entity';

export type Device = Entity & {
  connectionStatus: 'connected' | 'disconnected';
  connectionStatusUpdatedAt: number;
};
