import React, { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { User, Token, LoginResponseData } from '../types/auth';

interface AuthContextType {
  user: User | null;
  token: Token | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  confirmSignUp: (email: string, confirmationCode: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storedToken = localStorage.getItem('token');
  let initialToken: Token | null = null;
  if (storedToken && storedToken !== "undefined") {
    try {
      initialToken = JSON.parse(storedToken);
    } catch (error) {
      initialToken = null;
    }
  }

  const initialUser = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') as string)
    : null;

  const [token, setToken] = useState<Token | null>(initialToken);
  const [user, setUser] = useState<User | null>(initialUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', JSON.stringify(token));
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    const data: LoginResponseData = response.data;
    const tokenObj: Token = {
      AccessToken: data.AccessToken,
      RefreshToken: data.RefreshToken,
    };
    setToken(tokenObj);
    setUser({ email: data.email, name: data.name, username: data.username });
    localStorage.setItem('token', JSON.stringify(tokenObj));
    localStorage.setItem('user', JSON.stringify({ email: data.email, name: data.name, username: data.username }));
    navigate('/dashboard');
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await authService.register(name, email, password);
    const successMsg = response?.msg || "Cadastro realizado com sucesso. Verifique seu email e cole o código no formulário abaixo para finalizar o cadastro.";
    navigate('/auth/confirm-signup', { state: { success: successMsg } });
  };

  const confirmSignUp = async (email: string, confirmationCode: string) => {
    await authService.confirmSignUp(email, confirmationCode);
    navigate('/auth/login', { state: { success: "Confirmação realizada com sucesso! Agora faça login." } });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/auth/login');
  };

  const isLoggedIn = Boolean(token && user);

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, login, register, confirmSignUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
