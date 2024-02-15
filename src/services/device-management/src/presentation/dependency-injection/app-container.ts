import {
  AwilixContainer,
  Constructor,
  NameAndRegistrationPair,
  asClass,
  asValue,
  createContainer,
} from 'awilix';
import { getFromEnv } from './common/get-env-variable';
import { registerHandlers } from './handlers';
import { registerMongoDb } from './mongo';
import { LoggingSettings } from '../../application/interfaces/logger';
import { ConsoleLogger } from '../../infrastructure/logger';

export type IApplicationContainer = {
  register(params: NameAndRegistrationPair<any>): void;
  resolve<T = any>(key: string): T;
  build<T>(cls: Constructor<T>): T;
};

export class BaseApplicationContainer implements IApplicationContainer {
  public readonly container: AwilixContainer;

  public constructor() {
    this.container = createContainer({
      injectionMode: 'CLASSIC',
    });
  }

  public register(params: NameAndRegistrationPair<any>): void {
    this.container.register(params);
  }

  public resolve<T = any>(key: string): T {
    return this.container.resolve<T>(key);
  }

  public build<T>(cls: Constructor<T>): T {
    return this.container.build(cls);
  }

  protected static initSync(): ApplicationContainer {
    const container = new BaseApplicationContainer();

    // services
    container.register({
      loggingSettings: asValue<LoggingSettings>({
        level: getFromEnv('LOG_LEVEL', 'INFO'),
      }),
      logger: asClass(ConsoleLogger, { lifetime: 'SINGLETON' }),
    });

    registerHandlers(container);

    return container;
  }
}

export class ApplicationContainer extends BaseApplicationContainer {
  public constructor() {
    super();
  }

  public static async init(): Promise<ApplicationContainer> {
    const container = super.initSync();

    // async registrations only
    await registerMongoDb(container);

    // TODO register SNS event bus

    return container;
  }
}
