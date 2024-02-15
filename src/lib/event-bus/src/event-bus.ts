import { IntegrationEvent } from "./event";

type OmitUnion<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

export type EventBus = {
  publish: (event: OmitUnion<IntegrationEvent, "id" | "timestamp">) => void;
};
