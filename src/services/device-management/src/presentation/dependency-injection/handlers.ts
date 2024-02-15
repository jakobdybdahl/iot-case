import { asClass } from 'awilix';
import { ApplicationContainer } from './app-container';
import { GetDevicesHandler } from '../../application/handlers/get-devices.handler';

export const registerHandlers = (container: ApplicationContainer) => {
  container.register({
    getDevicesHandler: asClass(GetDevicesHandler),
  });
};
