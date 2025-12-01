import api from './api';

export interface CreateAccountRequestDTO {
  name: string;
  email: string;
  password: string;
}

export interface AccountResponseDTO {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  chatId: string;
}

export const accountService = {
  async createAccount(data: CreateAccountRequestDTO): Promise<AccountResponseDTO> {
    try {
      const response = await api.post<AccountResponseDTO>('v1/accounts', data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        // O servidor respondeu com um status de erro
        throw new Error(error.response.data.message || 'Erro ao criar conta');
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        throw new Error('Não foi possível conectar ao servidor');
      } else {
        // Algo aconteceu ao configurar a requisição
        throw new Error('Erro ao processar requisição');
      }
    }
  },
};
