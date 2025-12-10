import apiV2 from './apiV2';

export interface ConversationResponseDTO {
  id: string;
  title: string;
  updatedAt: string;
}

export interface ConversationMessageDTO {
  id: string;
  role: string;
  content: string;
  agentId: string;
  userMessageId: string;
  timestamp: string;
}

export interface SendMessageResponseDTO {
  conversationId: string;
  agentId: string;
  userMessageId: string;
  answers: string[];
}

export interface SendMessageRequest {
  conversationId?: string;
  userId: string;
  content: string;
}

class ConversationServiceV2 {
  async listConversations(chatId: string): Promise<ConversationResponseDTO[]> {
    const response = await apiV2.get<ConversationResponseDTO[]>(`/v1/conversations/chat/${chatId}`);
    return response.data;
  }

  async listMessages(chatId: string, conversationId: string): Promise<ConversationMessageDTO[]> {
    const response = await apiV2.get<ConversationMessageDTO[]>(
      `/v1/conversations/${conversationId}/chat/${chatId}/messages`,
      {
        params: { chatId }
      }
    );
    return response.data;
  }

  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponseDTO> {
    const response = await apiV2.post<SendMessageResponseDTO>(
      '/v1/conversations/send-message',
      request
    );
    return response.data;
  }
}

export const conversationServiceV2 = new ConversationServiceV2();
