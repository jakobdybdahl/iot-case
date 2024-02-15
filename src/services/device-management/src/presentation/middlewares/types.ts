import { Request } from '../endpoints/request';
import { Response } from '../endpoints/response';

export type Middleware = (
  req: Request,
  res: Response<unknown>,
) => Promise<Response<unknown>>;

export type MiddlewareFactory = (middleware: Middleware) => Middleware;
