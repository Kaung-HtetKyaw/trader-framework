import { signIn, signOut } from 'next-auth/react';
import axios from 'axios';
import config from './config';
import { AuthResponse } from '@/types/index';
import { QueryError } from '@/types/error';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { LogInPayload } from '@/types/auth';
import { BackendError, ErrorCodes } from './utils/error';

export const signInWithCredentials = async (data: LogInPayload): Promise<AuthResponse> => {
  try {
    const response = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (response?.error) {
      try {
        const error = JSON.parse(response.error) as BackendError;

        return {
          success: false,
          errorCode: error.errorCode || ErrorCodes.EKG50000,
          errorMessage: error.errorMessage,
        };
      } catch {
        return { success: false, errorCode: ErrorCodes.EKG40000, errorMessage: 'Invalid error format' };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Signin error', error);
    return { success: false, errorMessage: 'Signin error' };
  }
};

export const signUpWithCredentials = async (data: { email: string; password: string }): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${config.NEXT_PUBLIC_API_BASE_URL}/auth.register.basic`, {
      email: data.email,
      password: data.password,
    });

    if (response.status === 201 || response.status === 200) {
      return {
        success: true,
        redirectTo: `/verify?email=${encodeURIComponent(data.email)}&source=signup`,
      };
    }

    // TODO: update the wording of the error message if needed
    return { success: false, errorMessage: 'Unexpected response status' };
  } catch (error) {
    try {
      const errorData = (error as QueryError).response.data;
      return {
        success: false,
        errorCode: errorData.errorCode,
        errorMessage: errorData.errorMessage,
      };
    } catch {
      return { success: false, errorMessage: 'Invalid error format' };
    }
  }
};

//These API calls are for user Validation after signup
export const verifyUser = async (token: string): Promise<AuthResponse & { userID: string }> => {
  try {
    const response = await axios.post(`${config.NEXT_PUBLIC_API_BASE_URL}/auth.verify.user`, { verifyToken: token });
    if (response.status === 200 || response.status === 201) {
      return {
        userID: response.data.userID,
        success: true,
      };
    }

    return { success: false, errorMessage: 'Unexpected response status', userID: '' };
  } catch (error) {
    try {
      const errorData = (error as QueryError).response.data;
      return {
        userID: '',
        success: false,
        errorCode: errorData.errorCode,
        errorMessage: errorData.errorMessage,
      };
    } catch {
      return {
        userID: '',
        success: false,
        errorMessage: 'Invalid error format',
      };
    }
  }
};

export const handleVerifyUserResendLink = async (email: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${config.NEXT_PUBLIC_API_BASE_URL}/auth.verify.request`, { email: email });
    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
      };
    }

    return { success: false, errorMessage: 'Unexpected response status' };
  } catch (error) {
    try {
      const errorData = (error as QueryError).response.data;
      return {
        success: false,
        errorCode: errorData.errorCode,
        errorMessage: errorData.errorMessage,
      };
    } catch {
      return {
        success: false,
        errorMessage: 'Invalid error format',
      };
    }
  }
};

//These API calls are for forgot password from log-in page
export const forgotPasswordRequest = async (data: { email: string }): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${config.NEXT_PUBLIC_API_BASE_URL}/auth.forgotPassword.request`, {
      email: data.email,
    });

    if (response.status === 201 || response.status === 200) {
      return {
        success: true,
        redirectTo: `/verify?email=${encodeURIComponent(data.email)}&source=forgot-password`,
      };
    }

    return { success: false, errorMessage: 'Unexpected response status' };
  } catch (error) {
    try {
      const errorData = (error as QueryError)?.response.data;
      return {
        success: false,
        errorCode: errorData.errorCode,
        errorMessage: errorData.errorMessage,
      };
    } catch {
      return { success: false, errorMessage: 'Invalid error format' };
    }
  }
};

export const validateResetPasswordToken = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${config.NEXT_PUBLIC_API_BASE_URL}/auth.validate.forgotPasswordToken`, {
      forgotPasswordToken: token,
    });

    if (response.status === 201 || response.status === 200) {
      return {
        success: true,
      };
    }

    return { success: false, errorMessage: 'Unexpected response status' };
  } catch (error) {
    const errorData = (error as QueryError)?.response?.data;

    if (errorData?.errorCode) {
      return {
        success: false,
        errorCode: errorData.errorCode,
        errorMessage: errorData.errorMessage || 'Token validation failed',
      };
    }

    return { success: false, errorMessage: 'Invalid error format' };
  }
};

export const resetPassword = async (data: { forgotPasswordToken: string; password: string }): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${config.NEXT_PUBLIC_API_BASE_URL}/auth.forgotPassword.reset`, {
      forgotPasswordToken: data.forgotPasswordToken,
      newPassword: data.password,
    });

    if (response.status === 201 || response.status === 200) {
      return {
        success: true,
        redirectTo: `/reset-password/verify`,
      };
    }

    return { success: false, errorMessage: 'Unexpected response status' };
  } catch (error) {
    try {
      const errorData = (error as QueryError)?.response?.data;

      return {
        success: false,
        errorCode: errorData?.errorCode || ErrorCodes.EKG50000,
        errorMessage: errorData.errorMessage,
      };
    } catch {
      return { success: false, errorCode: ErrorCodes.EKG50000, errorMessage: 'Invalid error format' };
    }
  }
};

export const logoutAndRedirect = async () => {
  await signOut({ callbackUrl: '/log-in' });
};

export const acceptOrgInvitation = async (): Promise<AuthResponse> => {
  const session = await getServerSession(authOptions);

  try {
    const response = await axios.post(
      `${config.NEXT_PUBLIC_API_BASE_URL}/user.invite.accept`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      return { success: true, redirectTo: '/dashboard' };
    }

    return { success: false, errorMessage: 'Unexpected response status' };
  } catch (error) {
    try {
      const errorData = (error as QueryError).response.data;
      return { success: false, errorCode: errorData.errorCode, errorMessage: errorData.errorMessage };
    } catch {
      return { success: false, errorMessage: 'Invalid error format' };
    }
  }
};
