import api from './api';

export interface MessageFeedbackDTO {
  messageId: string;
  conversationId: string;
  type: 'positive' | 'negative' | 'report';
  issues?: string[];
  comment?: string;
  userId: string;
  timestamp: Date;
}

export interface ConversationFeedbackDTO {
  conversationId: string;
  resolved: boolean;
  rating?: number;
  comment?: string;
  userId: string;
  trigger: 'gratitude' | 'multiple_exchanges' | 'reformulation' | 'manual';
  timestamp: Date;
}

export interface FeedbackAnalyticsDTO {
  totalFeedbacks: number;
  positiveRate: number;
  negativeRate: number;
  avgRating: number;
  commonIssues: Array<{ issue: string; count: number }>;
  resolutionRate: number;
}

export const feedbackService = {
  // Enviar feedback de mensagem individual
  async submitMessageFeedback(feedback: Omit<MessageFeedbackDTO, 'timestamp'>): Promise<void> {
    try {
      await api.post('v1/feedback/message', {
        ...feedback,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Erro ao enviar feedback de mensagem:', error);
      throw new Error(error.response?.data?.message || 'Erro ao enviar feedback');
    }
  },

  // Enviar feedback de conversa
  async submitConversationFeedback(feedback: Omit<ConversationFeedbackDTO, 'timestamp'>): Promise<void> {
    try {
      await api.post('v1/feedback/conversation', {
        ...feedback,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Erro ao enviar feedback de conversa:', error);
      throw new Error(error.response?.data?.message || 'Erro ao enviar feedback');
    }
  },

  // Buscar analytics de feedback (para o admin)
  async getFeedbackAnalytics(chatId: string, startDate?: Date, endDate?: Date): Promise<FeedbackAnalyticsDTO> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());

      const response = await api.get<FeedbackAnalyticsDTO>(
        `v1/feedback/analytics/${chatId}?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar analytics de feedback:', error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar analytics');
    }
  },

  // Buscar feedbacks negativos (para melhorias)
  async getNegativeFeedbacks(chatId: string, limit: number = 50): Promise<MessageFeedbackDTO[]> {
    try {
      const response = await api.get<MessageFeedbackDTO[]>(
        `v1/feedback/negative/${chatId}?limit=${limit}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar feedbacks negativos:', error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar feedbacks');
    }
  },

  // Buscar feedbacks por conversa
  async getConversationFeedbacks(conversationId: string): Promise<{
    messageFeedbacks: MessageFeedbackDTO[];
    conversationFeedback?: ConversationFeedbackDTO;
  }> {
    try {
      const response = await api.get(`v1/feedback/conversation/${conversationId}`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar feedbacks da conversa:', error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar feedbacks');
    }
  }
};
