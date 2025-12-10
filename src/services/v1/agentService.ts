import api from './api';
import apiV2 from '../v2/apiV2';

const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
const apiInstance = API_VERSION === 'v2' ? apiV2 : api;

export interface Agent {
  id: string;
  name: string;
  avatarUrl?: string;
  gptMakerAgentId?: string;
  unep?: string;
  businessUnit?: string;
  description?: string;
  behavior?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Training {
  id: string;
  agentId: string;
  fileName: string;
  fileType: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
}

class AgentService {
  async listAgents(): Promise<Agent[]> {
    const response = await apiInstance.get<Agent[]>('/v1/admin/agents');
    return response.data;
  }

  async getAgent(agentId: string): Promise<Agent> {
    const response = await apiInstance.get<Agent>(`/v1/admin/agents/${agentId}`);
    return response.data;
  }

  async uploadTraining(agentId: string, file: File): Promise<Training[]> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiInstance.post<Training[]>(
      `/v1/agents/${agentId}/training`,
      formData,
      {
        headers: {
          'Content-Type': undefined,
        },
      }
    );
    return response.data;
  }

  async uploadMultipleTraining(agentId: string, files: File[]): Promise<Training[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await apiInstance.post<Training[]>(
      `/v1/agents/${agentId}/training/batch`,
      formData,
      {
        headers: {
          'Content-Type': undefined,
        },
      }
    );
    return response.data;
  }

  async listTrainings(agentId: string): Promise<Training[]> {
    const response = await apiInstance.get<Training[]>(`/v1/agents/${agentId}/training`);
    return response.data;
  }

  async syncAgents(workspaceId: string): Promise<Agent[]> {
    const response = await apiInstance.post<Agent[]>(`/v1/admin/agents/sync`, null, {
      params: { workspaceId }
    });
    return response.data;
  }
}

export const agentService = new AgentService();
