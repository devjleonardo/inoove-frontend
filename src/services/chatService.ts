import api from './api';

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageDTO {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface AskRequestDTO {
  text: string;
  userId: string;
}

export interface AskResponseDTO {
  answer: string;
  conversationId: string;
  source: string;
  retrievedNodeIds: string[];
}

export const chatService = {
  async listConversations(chatId: string): Promise<Conversation[]> {
    try {
      const response = await api.get<Conversation[]>(`v1/chat/${chatId}/conversations`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Erro ao listar conversas');
      } else if (error.request) {
        throw new Error('Não foi possível conectar ao servidor');
      } else {
        throw new Error('Erro ao processar requisição');
      }
    }
  },

  async getMessages(chatId: string, conversationId: string): Promise<MessageDTO[]> {
    try {
      const response = await api.get<MessageDTO[]>(`v1/chat/${chatId}/conversations/${conversationId}/messages`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Erro ao carregar mensagens');
      } else if (error.request) {
        throw new Error('Não foi possível conectar ao servidor');
      } else {
        throw new Error('Erro ao processar requisição');
      }
    }
  },

  async createConversation(chatId: string, title: string): Promise<Conversation> {
    try {
      const response = await api.post<Conversation>(`v1/chat/${chatId}/create-conversation`, {
        title,
        chatId,
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Erro ao criar conversa');
      } else if (error.request) {
        throw new Error('Não foi possível conectar ao servidor');
      } else {
        throw new Error('Erro ao processar requisição');
      }
    }
  },

  async ask(chatId: string, conversationId: string | undefined, data: AskRequestDTO): Promise<AskResponseDTO> {
    try {
      const response = await api.post<AskResponseDTO>(`v1/chat/${chatId}/conversations/send-ask`, {
        text: data.text.trim(),
        userId: data.userId,
        conversationId: conversationId || null,
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Erro ao processar mensagem');
      } else if (error.request) {
        throw new Error('Não foi possível conectar ao servidor');
      } else {
        throw new Error('Erro ao processar requisição');
      }
    }
  },
};
