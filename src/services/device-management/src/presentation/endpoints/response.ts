type BaseResponse = {
  headers?: { [header: string]: boolean | number | string } | undefined;
};

export type Response<T> =
  | NotFoundResponse
  | BadRequestResponse
  | UnauthorizedResponse
  | ForbiddenResponse
  | OkResponse<T>
  | CreatedResponse<T>
  | NoContentResponse
  | InternalServerError;

export type NotFoundResponse = BaseResponse & {
  status: 404;
  title: 'Not Found';
  resourceName: string;
};

export type BadRequestResponse<T = unknown> = BaseResponse & {
  status: 400;
  title: 'Bad Request';
  type: string;
  detail: T;
};

export type UnauthorizedResponse = BaseResponse & {
  status: 401;
  title: 'Unauthorized';
};

export type ForbiddenResponse = BaseResponse & {
  status: 403;
  title: 'Forbidden';
  detail: string;
};

export type OkResponse<T> = BaseResponse & {
  status: 200;
  body: T;
};

export type CreatedResponse<T> = BaseResponse & {
  status: 201;
  body: T;
};

export type NoContentResponse = BaseResponse & {
  status: 204;
};

export type InternalServerError = BaseResponse & {
  status: 500;
  message: string;
};
