import {
  DeviceConnectionChangeEvent,
  DeviceCreatedEvent,
  DeviceProvisionedEvent,
} from "./events";

type Event =
  | DeviceCreatedEvent
  | DeviceProvisionedEvent
  | DeviceConnectionChangeEvent;

export type EventType = Event["type"];

export type IntegrationEvent = {
  id: string;
  timestamp: number;
} & Event;
