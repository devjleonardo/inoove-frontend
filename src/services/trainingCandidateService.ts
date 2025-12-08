import api from './api';

export interface TrainingCandidate {
  id: string;
  messageId: string;
  question: string;
  aiAnswer: string;
  createdAt: string;
  converted: boolean;
}

export interface AiNode {
  id: string;
  topic: string;
  // Add other AiNode fields as needed
}

class TrainingCandidateService {
  async listCandidates(): Promise<TrainingCandidate[]> {
    const response = await api.get<TrainingCandidate[]>('/v1/admin/training/candidates');
    return response.data;
  }

  async convert(id: string, topic: string): Promise<AiNode> {
    const response = await api.post<AiNode>(`/v1/admin/training/convert/${id}`, null, {
      params: { topic }
    });
    return response.data;
  }
}

export const trainingCandidateService = new TrainingCandidateService();
