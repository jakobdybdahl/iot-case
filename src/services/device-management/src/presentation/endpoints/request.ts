import { AwilixContainer } from 'awilix';

export type Query = {
  [key: string]: string | string[] | undefined;
};
export type Params = { [key: string]: undefined | string };

export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE'] as const;
export type HttpMethod = (typeof HTTP_METHODS)[number];

type AuthenticatedUser = {
  isAuthenticated: true;
  id: string;
  roles: string[];
  customerId: string;
  token: string;
};

type NotAuthenticatedUser = {
  isAuthenticated: false;
};

export type User = AuthenticatedUser | NotAuthenticatedUser;

export type Request = {
  query: Query;
  params: Params;
  path: string;
  headers?:
    | { [header: string]: boolean | number | string | string[] | undefined }
    | undefined;
  method: HttpMethod;
  user: User;
  container: AwilixContainer;
  body: unknown | null;
};

export type RawRequest = Omit<Request, 'user' | 'container'>;

export type HttpContext = Omit<Request, 'container'>;
