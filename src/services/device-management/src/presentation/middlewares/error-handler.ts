import { Logger } from '../../application/interfaces/logger';
import { MiddlewareFactory } from './types';

export const errorHandler: MiddlewareFactory = (next) => {
  return async (req, res) => {
    try {
      return await next(req, res);
    } catch (error: unknown) {
      const logger = req.container.resolve<Logger>('logger');

      let message = '';
      if (error instanceof Error) {
        message = `[${error.name}]: ${error.message}`;
      }

      logger.error(message, error);

      return {
        status: 500,
        message: `Unhandled error thrown.${
          message !== '' ? ` ${message}` : ''
        }`,
      };
    }
  };
};
