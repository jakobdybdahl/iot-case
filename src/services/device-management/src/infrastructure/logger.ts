import winston from 'winston';
import {
  Logger,
  LogLevel,
  LoggingSettings,
  isLogLevelKey,
} from '../application/interfaces/logger';

const logLevelValues: { [Key in LogLevel as Lowercase<Key & string>]: number } =
  {
    debug: 3,
    info: 2,
    warn: 1,
    error: 0,
  };

const logLevelToWinstonLevel: { [Key in LogLevel]: string } = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
} as const;

type Message = object | string | unknown;

export class ConsoleLogger implements Logger {
  private readonly logger: winston.Logger;

  public constructor(loggingSettings: LoggingSettings) {
    const logLevelString = loggingSettings.level;
    const logLevelKey = logLevelString.toUpperCase();

    if (!isLogLevelKey(logLevelKey)) {
      throw new Error(`Invalid log level: ${logLevelString}`);
    }

    this.logger = winston.createLogger({
      levels: logLevelValues,
      level: logLevelToWinstonLevel[logLevelKey],
      format: winston.format.combine(
        winston.format((info) => {
          info.level = info.level.toUpperCase();

          return info;
        })(),
        winston.format.timestamp(),
        winston.format.splat(),
        winston.format.errors({ stack: true }),
        winston.format.json({ space: 2 }),
      ),
      transports: [new winston.transports.Console()],
    });
  }

  public debug(message: Message, ...meta: unknown[]): void {
    this.logMessage('DEBUG', message, ...meta);
  }

  public log(message: Message, ...meta: unknown[]): void {
    this.logMessage('INFO', message, ...meta);
  }

  public info(message: Message, ...meta: unknown[]): void {
    this.logMessage('INFO', message, ...meta);
  }

  public warn(message: Message, ...meta: unknown[]): void {
    this.logMessage('WARN', message, ...meta);
  }

  public error(message: Message, ...meta: unknown[]): void {
    this.logMessage('ERROR', message, ...meta);
  }

  private logMessage(
    level: LogLevel,
    message: Message,
    ...meta: unknown[]
  ): void {
    if (typeof message === 'string') {
      this.logger.log(logLevelToWinstonLevel[level], message, ...meta);
    } else {
      this.logger.log(logLevelToWinstonLevel[level], { message });
    }
  }
}
