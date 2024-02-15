import {
  APIGatewayProxyResult,
  APIGatewayProxyWithCognitoAuthorizerHandler,
} from 'aws-lambda';
import { RawRequest } from '../endpoints/request';
import { toHttpMethod } from '../endpoints/utils';
import { EndpointHandler } from '../endpoints/make-endpoint';
import { toLambdaResponse } from './responses';
import { Response } from '../endpoints/response';

type HandlerParams = Parameters<APIGatewayProxyWithCognitoAuthorizerHandler>;

type Event = HandlerParams[0];

export const fromEndpoint = (handler: EndpointHandler) => {
  return async (event: Event): Promise<APIGatewayProxyResult> => {
    const request: RawRequest = {
      params: event.pathParameters ?? {},
      query: event.queryStringParameters ?? {},
      path: event.path,
      headers: event.headers,
      method: toHttpMethod(event.httpMethod),
      body: event.body ? JSON.parse(event.body) : null,
    };

    const response = await handler(request);

    const toResponse = toLambdaResponse[response.status] as (
      response: Response<unknown>,
    ) => APIGatewayProxyResult;

    return toResponse(response);
  };
};
