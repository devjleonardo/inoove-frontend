import api from './api';

export interface MaturityPerGroupDTO {
  groupName: string;
  maturityScore: number;
  repeatedQuestionsRate: number;
  lowConfidenceRate: number;
  gapsRate: number;
  reuseRate: number;
}

export interface MaturityIndexDTO {
  globalScore: number;
  bySector: MaturityPerGroupDTO[];
  byUnit: MaturityPerGroupDTO[];
}

export interface PainIndexItemDTO {
  topic: string;
  repeatedQuestions: number;
  lowConfidenceCount: number;
  gaps: number;
  painScore: number;
}

export interface RoiInsightsDTO {
  hoursSaved: number;
  costSaved: number;
  reuseRate: number;
}

export interface AlertDTO {
  type: string;
  message: string;
  date: string;
}

export interface TrainingRadarItemDTO {
  topic: string;
  candidates: number;
  suggestedOwner: string;
}

export interface MonthlyKnowledgeStatsDTO {
  month: string;
  avgConfidence: number;
  reuseRate: number;
  totalMessages: number;
  totalQuestions: number;
  topicsCount: number;
  gapsCreated: number;
  gapsResolved: number;
}

export interface KnowledgeEvolutionDTO {
  months: MonthlyKnowledgeStatsDTO[];
}

export interface AskiaIntelligenceDashboardDTO {
  maturity: MaturityIndexDTO;
  painIndex: PainIndexItemDTO[];
  roi: RoiInsightsDTO;
  alerts: AlertDTO[];
  trainingRadar: TrainingRadarItemDTO[];
  evolution: KnowledgeEvolutionDTO;
}

class IntelligenceDashboardService {
  async getIntelligenceDashboard(): Promise<AskiaIntelligenceDashboardDTO> {
    const response = await api.get<AskiaIntelligenceDashboardDTO>('/v1/admin/intelligence-dashboard');
    return response.data;
  }
}

export const intelligenceDashboardService = new IntelligenceDashboardService();
