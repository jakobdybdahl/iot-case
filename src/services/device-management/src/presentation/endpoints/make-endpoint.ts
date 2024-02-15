import { Constructor, asValue } from 'awilix';
import { errorHandler } from '../middlewares/error-handler';
import { requestLogger } from '../middlewares/request-logger';
import { Middleware, MiddlewareFactory } from '../middlewares/types';
import { BaseEndpoint } from './base-endpoint';
import { HttpContext, RawRequest, Request } from './request';
import { InternalServerError, Response } from './response';
import { makeAppContainer } from '../dependency-injection/make-app-container';

const globalMiddlewares: MiddlewareFactory[] = [errorHandler, requestLogger];

const endpoint: <T extends BaseEndpoint>(
  cls: Constructor<T>,
) => MiddlewareFactory = (cls) => (next) => async (req, res) => {
  const instance = req.container.build(cls);

  const response = await instance.handle(req, res);

  return await next(req, response);
};

const registerHttpContext: MiddlewareFactory = (next) => async (req, res) => {
  const { container, ...httpContext } = req;

  req.container.register({
    httpContext: asValue<HttpContext>(httpContext),
  });

  return await next(req, res);
};

function stackMiddlewares(
  functions: MiddlewareFactory[] = [],
  index = 0,
): Middleware {
  const current = functions[index];
  if (current) {
    const next = stackMiddlewares(functions, index + 1);
    return current(next);
  }
  return (_, res) => Promise.resolve(res);
}

type MakeAppContainerFn = () => ReturnType<typeof makeAppContainer>;
type EndpointOptions = {
  middlewares?: MiddlewareFactory[];
};

export type EndpointHandler = (rew: RawRequest) => Promise<Response<unknown>>;

export const makeEndpoint =
  <T extends BaseEndpoint>(
    endpointCls: Constructor<T>,
    options: EndpointOptions = {},
  ) =>
  (makeAppContainer: MakeAppContainerFn) =>
  async (rawReq: RawRequest): Promise<Response<unknown>> => {
    const appContainer = await makeAppContainer();

    const req: Request = {
      ...rawReq,
      user: { isAuthenticated: false },
      container: appContainer.container.createScope(),
    };

    const combined = stackMiddlewares([
      ...globalMiddlewares,
      ...(options.middlewares ?? []),
      registerHttpContext,
      endpoint(endpointCls),
    ]);

    const initialResponse: InternalServerError = {
      status: 500,
      message: 'No response set',
    };

    return await combined(req, initialResponse);
  };
