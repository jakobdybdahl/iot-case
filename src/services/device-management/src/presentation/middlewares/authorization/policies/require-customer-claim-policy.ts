import { Policy } from '../authorize';

export const requireCustomerId: Policy = (req) => {
  const user = req.user;

  if (!user.isAuthenticated) {
    return { success: false, message: 'User is not authenticated' };
  }

  if (user.customerId === null) {
    return {
      success: false,
      message: 'The user do not have a customer id',
    };
  }

  return { success: true };
};
