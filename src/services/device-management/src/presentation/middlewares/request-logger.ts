import { Logger } from '../../application/interfaces/logger';
import { MiddlewareFactory } from './types';

export const requestLogger: MiddlewareFactory = (next) => {
  return async (req, res) => {
    const logger = req.container.resolve<Logger>('logger');

    logger.info('Handling request.', {
      path: req.path,
      method: req.method,
      query: req.query,
    });

    const start = performance.now();
    const response = await next(req, res);
    const end = performance.now();

    let message = `Status code: ${response.status}`;
    if (response.status === 500) {
      message = message + ` Message: ${response.message}`;
    }

    logger.info('Request finished.', {
      path: req.path,
      method: req.method,
      statusCode: response.status,
      elapsed: (end - start).toFixed(2),
      message,
    });

    return response;
  };
};
