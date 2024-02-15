import { APIGatewayProxyResult } from 'aws-lambda';
import { Response } from '../endpoints/response';

export const toLambdaResponse: {
  [key in Response<unknown>['status']]: <
    T extends Response<unknown> & { status: key },
  >(
    response: T,
  ) => APIGatewayProxyResult;
} = {
  '200': (response) => ({
    statusCode: 200,
    body: JSON.stringify(response.body),
    headers: response.headers,
  }),
  '201': (response) => ({
    statusCode: 201,
    body: JSON.stringify(response.body),
    headers: response.headers,
  }),
  '204': (response) => ({
    statusCode: 204,
    headers: response.headers,
    body: 'Created',
  }),
  '400': (response) => ({
    statusCode: 400,
    body: JSON.stringify({
      title: response.title,
      type: response.type,
      detail: response.detail,
    }),
    headers: response.headers,
  }),
  '401': (response) => ({
    statusCode: 401,
    body: JSON.stringify({
      title: response.title,
    }),
    headers: response.headers,
  }),
  '403': (response) => ({
    statusCode: 403,
    body: JSON.stringify({
      title: response.title,
      message: response.detail,
    }),
    headers: response.headers,
  }),
  '404': (response) => ({
    statusCode: 404,
    body: JSON.stringify({
      title: response.title,
      resourceName: response.resourceName,
    }),
    headers: response.headers,
  }),
  '500': (_response) => ({
    statusCode: 500,
    body: 'Internal Server Error',
  }),
};
