import api from './api';
import { LoginResponse, RegistrationResponse, ConfirmSignUpResponse } from '../types/auth';

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    '/auth/login',
    { username: email, password }
  );
  return response.data;
};

export const register = async (name: string, email: string, password: string): Promise<RegistrationResponse> => {
  const response = await api.post<RegistrationResponse>(
    '/auth/sign-up',
    { username: email, password, email, name }
  );
  return response.data;
};

export const confirmSignUp = async (email: string, confirmationCode: string): Promise<ConfirmSignUpResponse> => {
  const response = await api.post<ConfirmSignUpResponse>(
    '/auth/confirm-sign-up',
    { username: email, confirmation_code: confirmationCode }
  );
  return response.data;
};
