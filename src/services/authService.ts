import api from './api';
import { AccountResponseDTO } from './accountService';

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  chatId: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponseDTO> {
    try {
      const response = await api.post<LoginResponseDTO>('v1/auth/sign-in', {
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Email ou senha inválidos');
      } else if (error.request) {
        throw new Error('Não foi possível conectar ao servidor');
      } else {
        throw new Error('Erro ao processar requisição');
      }
    }
  },
};
