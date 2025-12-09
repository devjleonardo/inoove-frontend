'use client';

import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Users,
  Clock,
  Target,
  Zap,
  Timer,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Bot,
  Loader,
  Award,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import KnowledgeHeatmap from '../components/KnowledgeHeatmap';
import { dashboardService, AskiaDashboardDTO, ConfidenceDashboardDTO } from '@/services/dashboardService';

interface OverviewSectionProps {
  isDarkMode: boolean;
}

export default function OverviewSection({ isDarkMode }: OverviewSectionProps) {
  const [dashboardData, setDashboardData] = useState<AskiaDashboardDTO | null>(null);
  const [confidenceData, setConfidenceData] = useState<ConfidenceDashboardDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [dashboard, confidence] = await Promise.all([
        dashboardService.getDashboard(),
        dashboardService.getConfidenceDashboard()
      ]);
      setDashboardData(dashboard);
      setConfidenceData(confidence);
    } catch (err: any) {
      console.error('Erro ao carregar dashboard:', err);
      setError('Erro ao carregar dados do dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <Loader className="w-6 h-6 animate-spin" />
          <span>Carregando dashboard...</span>
        </div>
      </div>
    );
  }

  if (error || !dashboardData || !confidenceData) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          <div>
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">Erro</h3>
            <p className="text-sm text-red-700 dark:text-red-300">{error || 'Falha ao carregar dados'}</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Métricas Principais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Intervalo Médio entre Mensagens
                </p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {(dashboardData.avgMessageInterval ?? 0).toFixed(1)}min
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Tempo médio entre perguntas
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Taxa de Reuso de Conhecimento
                </p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {((dashboardData.knowledgeReuseRate ?? 0) * 100).toFixed(1)}%
                </h3>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Conhecimento reutilizado
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Perguntas Não Respondidas
                </p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {dashboardData.unansweredQuestions ?? 0}
                </h3>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  Requer atenção
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Métricas de Confiança
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Confiança Média
                </p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {((confidenceData.avgConfidence ?? 0) * 100).toFixed(1)}%
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Score médio de confiança
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Alta Confiança
                </p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {confidenceData.highConfidenceCount ?? 0}
                </h3>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Respostas com alta confiança
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <ThumbsUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Baixa Confiança
                </p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {confidenceData.lowConfidenceCount ?? 0}
                </h3>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  Requer revisão
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <ThumbsDown className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div>
        <KnowledgeHeatmap isDarkMode={isDarkMode} />
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Tópicos Mais Consultados
            </h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {dashboardData.topTopics.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-8">
                Nenhum tópico registrado ainda
              </p>
            ) : (
              dashboardData.topTopics.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-lg font-bold text-gray-400 dark:text-gray-500">
                      #{index + 1}
                    </span>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item.topic}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Uso por Agente
            </h2>
            <Bot className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {dashboardData.agentUsage.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-8">
                Nenhum uso de agente registrado
              </p>
            ) : (
              dashboardData.agentUsage.map((agent, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-[#FFDE14] to-[#FFEA5F] rounded-lg overflow-hidden flex items-center justify-center">
                      {agent.avatarUrl ? (
                        <img
                          src={agent.avatarUrl}
                          alt={agent.agentName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <Bot className={`w-5 h-5 text-gray-900 ${agent.avatarUrl ? 'hidden' : ''}`} />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {agent.agentName}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {agent.count} {agent.count === 1 ? 'uso' : 'usos'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Perguntas por Tipo de Usuário
          </h2>
          <Users className="w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardData.questionsPerUserType.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-8 col-span-full">
              Nenhuma estatística de usuário disponível
            </p>
          ) : (
            dashboardData.questionsPerUserType.map((userStat, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">
                    {userStat.userType}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1 truncate">
                  {userStat.userName}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userStat.totalQuestions}
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-1">
                    perguntas
                  </span>
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Confiança por Tipo de Usuário
            </h2>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {confidenceData.confidenceByUserType.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-8">
                Nenhum dado disponível
              </p>
            ) : (
              confidenceData.confidenceByUserType.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.userType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full"
                        style={{ width: `${item.avgConfidence * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white min-w-[45px] text-right">
                      {(item.avgConfidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Confiança por Agente
            </h2>
            <Bot className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {confidenceData.confidenceByAgent.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-8">
                Nenhum dado disponível
              </p>
            ) : (
              confidenceData.confidenceByAgent.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-[#FFDE14] to-[#FFEA5F] rounded-lg overflow-hidden flex items-center justify-center">
                      {item.avatarUrl ? (
                        <img
                          src={item.avatarUrl}
                          alt={item.agentName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <Bot className={`w-5 h-5 text-gray-900 ${item.avatarUrl ? 'hidden' : ''}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.agentName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#FFDE14] to-[#FFEA5F] h-2 rounded-full"
                        style={{ width: `${item.avgConfidence * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white min-w-[45px] text-right">
                      {(item.avgConfidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Mensagens com Baixa Confiança
          </h2>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
              {confidenceData.lowConfidenceMessages.length} mensagens
            </span>
          </div>
        </div>
        <div className="space-y-4">
          {confidenceData.lowConfidenceMessages.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-8">
              Nenhuma mensagem com baixa confiança
            </p>
          ) : (
            confidenceData.lowConfidenceMessages.map((msg, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-800"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                      CONFIANÇA: {(msg.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Bot className="w-3 h-3" />
                    <span className="font-mono">{msg.agentId}</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {msg.question}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-mono">Msg: {msg.messageId.substring(0, 8)}...</span>
                  <span className="font-mono">Conv: {msg.conversationId.substring(0, 8)}...</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
