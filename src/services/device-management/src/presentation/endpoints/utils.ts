import { HTTP_METHODS, HttpMethod } from './request';

export const toHttpMethod = (method: string): HttpMethod => {
  const httpMethod = HTTP_METHODS.find((m) => m === method);
  if (httpMethod !== undefined) return httpMethod;

  throw new Error(`Unknown HTTP Method: ${method}`);
};
