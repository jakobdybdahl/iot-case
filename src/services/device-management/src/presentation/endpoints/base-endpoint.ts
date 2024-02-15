import { Request } from './request';
import {
  BadRequestResponse,
  NoContentResponse,
  OkResponse,
  Response,
  UnauthorizedResponse,
} from './response';

export abstract class BaseEndpoint {
  public abstract handle(
    req: Request,
    res: Response<unknown>,
  ): Promise<Response<unknown>>;

  protected ok<T>(body: T): OkResponse<T> {
    return {
      status: 200,
      body,
    };
  }

  protected badRequest<T = unknown>(
    type: string,
    detail: T,
  ): BadRequestResponse<T> {
    return {
      status: 400,
      title: 'Bad Request',
      type,
      detail,
    };
  }

  protected noContent(): NoContentResponse {
    return {
      status: 204,
    };
  }

  protected unauthorized(): UnauthorizedResponse {
    return {
      status: 401,
      title: 'Unauthorized',
    };
  }
}
