import api from './api';

export interface CreateAccountRequestDTO {
  name: string;
  email: string;
  password: string;
  businessUnit: string;
  sector?: string;
  unep?: string;
}

export interface AccountResponseDTO {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  chatId: string;
  role?: 'user' | 'admin';
  gptMakerWorkspaceId?: string;
}

export const accountService = {
  async createAccount(data: CreateAccountRequestDTO): Promise<AccountResponseDTO> {
    try {
      const response = await api.post<AccountResponseDTO>('v1/accounts', data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Erro ao criar conta');
      } else if (error.request) {
        throw new Error('Não foi possível conectar ao servidor');
      } else {
        throw new Error('Erro ao processar requisição');
      }
    }
  },
};
