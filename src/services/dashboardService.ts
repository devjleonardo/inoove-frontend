import api from './api';

export interface TopicUsageDTO {
  topic: string;
  count: number;
}

export interface UserQuestionStatsDTO {
  userType: string;
  userName: string;
  totalQuestions: number;
}

export interface AgentUsageDTO {
  agentName: string;
  avatarUrl?: string;
  count: number;
}

export interface AskiaDashboardDTO {
  topTopics: TopicUsageDTO[];
  questionsPerUserType: UserQuestionStatsDTO[];
  agentUsage: AgentUsageDTO[];
  avgMessageInterval?: number | null;
  knowledgeReuseRate?: number | null;
  unansweredQuestions?: number | null;
}

export interface ConfidenceByUserTypeDTO {
  userType: string;
  avgConfidence: number;
}

export interface ConfidenceByAgentDTO {
  agentName: string;
  agentId: string;
  avatarUrl: string;
  avgConfidence: number;
}

export interface LowConfidenceMessageDTO {
  messageId: string;
  question: string;
  confidence: number;
  conversationId: string;
  agentId: string;
}

export interface ConfidenceDashboardDTO {
  avgConfidence?: number | null;
  highConfidenceCount?: number | null;
  lowConfidenceCount?: number | null;
  confidenceByUserType: ConfidenceByUserTypeDTO[];
  confidenceByAgent: ConfidenceByAgentDTO[];
  lowConfidenceMessages: LowConfidenceMessageDTO[];
}

class DashboardService {
  async getDashboard(): Promise<AskiaDashboardDTO> {
    const response = await api.get<AskiaDashboardDTO>('/v1/admin/dashboard');
    return response.data;
  }

  async getConfidenceDashboard(): Promise<ConfidenceDashboardDTO> {
    const response = await api.get<ConfidenceDashboardDTO>('/v1/admin/dashboard/confidence');
    return response.data;
  }
}

export const dashboardService = new DashboardService();
