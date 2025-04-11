export interface User {
  email: string;
  name: string;
  username: string;
}

export interface Token {
  AccessToken: string;
  RefreshToken: string;
}

export interface LoginResponseData {
  AccessToken: string;
  ExpiresIn: number;
  IdToken: string;
  RefreshToken: string;
  TokenType: string;
  email: string;
  name: string;
  username: string;
}

export interface LoginResponse {
  data: LoginResponseData;
  msg: string;
  status: string;
}

export interface RegistrationResponse {
  status: string;
  data: {};
  msg: string;
}

export interface ConfirmSignUpResponse {
  message: string;
}
