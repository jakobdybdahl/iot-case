import { Request } from '../../endpoints/request';
import { MiddlewareFactory } from '../types';

type PolicyResult = { success: false; message: string } | { success: true };
export type Policy = (req: Request) => PolicyResult;

export const authorize: (
  policies: Array<Policy> | Policy,
) => MiddlewareFactory = (policies) => (next) => async (req, res) => {
  if (!req.user.isAuthenticated) {
    return {
      status: 401,
      title: 'Unauthorized',
    };
  }

  if (!Array.isArray(policies)) {
    policies = [policies];
  }

  for (const policy of policies) {
    const isAuthorized = policy(req);

    if (!isAuthorized.success) {
      return {
        status: 403,
        title: 'Forbidden',
        detail: isAuthorized.message,
      };
    }
  }

  return next(req, res);
};
