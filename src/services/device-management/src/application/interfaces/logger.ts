export const ALL_LOG_LEVELS = ['DEBUG', 'INFO', 'WARN', 'ERROR'] as const;

export type LogLevel = (typeof ALL_LOG_LEVELS)[number];

export const isLogLevelKey = (key: string): key is LogLevel => {
  return ALL_LOG_LEVELS.some((level) => level === key);
};

export type LeveledLogMethod = {
  (message: object): void;
  (message: string): void;
  (message: string, meta: object): void;
  (message: string, ...meta: unknown[]): void;
  (message: unknown): void;
};

export type Logger = {
  [Level in LogLevel as Lowercase<Level & string>]: LeveledLogMethod;
} & {
  log: LeveledLogMethod; // alias for info
};

export type LoggingSettings = {
  level: string;
};
