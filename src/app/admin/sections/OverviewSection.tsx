'use client';

import {
  MessageSquare,
  Users,
  Clock,
  Target,
  Zap,
  Timer,
  BarChart3,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import KnowledgeHeatmap from '../components/KnowledgeHeatmap';

interface OverviewSectionProps {
  isDarkMode: boolean;
}

export default function OverviewSection({ isDarkMode }: OverviewSectionProps) {
  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Métricas Principais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total de Conversas */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total de Conversas
                </p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  1,234
                </h3>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +12% vs semana anterior
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Usuários Ativos */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Usuários Ativos
                </p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  89
                </h3>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +5% vs semana anterior
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          {/* Tempo Médio */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Tempo Médio
                </p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  2.3s
                </h3>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  -15% vs semana anterior
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Taxa de Acerto */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Taxa de Acerto
                </p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  94.2%
                </h3>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +2% vs semana anterior
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Target className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Tempo Médio Pergunta-Resposta */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Tempo P&R
                </p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  1.8s
                </h3>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  -22% vs semana anterior
                </p>
              </div>
              <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                <Zap className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>
          </div>

          {/* Economia Gerada */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Horas Economizadas
                </p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  280h
                </h3>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Últimas 4 semanas
                </p>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Timer className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Knowledge Heatmap */}
      <div>
        <KnowledgeHeatmap isDarkMode={isDarkMode} />
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 Dúvidas */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Top 10 Dúvidas Recorrentes
            </h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {[
              { question: 'Como integrar WhatsApp?', count: 145, trend: 'up' },
              { question: 'Configurar webhook Z-API', count: 132, trend: 'up' },
              { question: 'Limite de mensagens', count: 98, trend: 'stable' },
              { question: 'Criar campanha automatizada', count: 87, trend: 'up' },
              { question: 'QR Code não conecta', count: 76, trend: 'down' },
              { question: 'Exportar relatórios', count: 64, trend: 'stable' },
              { question: 'Alterar plano', count: 58, trend: 'down' },
              { question: 'API rate limit', count: 52, trend: 'up' },
              { question: 'Mensagens em massa', count: 47, trend: 'stable' },
              { question: 'Integração CRM', count: 41, trend: 'up' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-lg font-bold text-gray-400 dark:text-gray-500">
                    #{index + 1}
                  </span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {item.question}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {item.count}
                  </span>
                  <span
                    className={`text-xs ${
                      item.trend === 'up'
                        ? 'text-red-600 dark:text-red-400'
                        : item.trend === 'down'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas de Treinamento */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Alertas de Treinamento
            </h2>
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-4">
            {[
              {
                title: 'Campanhas Z-API',
                volume: 312,
                growth: '+250%',
                priority: 'high',
                recommendation: 'Workshop urgente recomendado'
              },
              {
                title: 'Webhooks Plug Chat',
                volume: 198,
                growth: '+180%',
                priority: 'high',
                recommendation: 'Criar documentação detalhada'
              },
              {
                title: 'Relatórios GPT Maker',
                volume: 156,
                growth: '+120%',
                priority: 'medium',
                recommendation: 'Vídeo tutorial recomendado'
              },
              {
                title: 'Planos Kigi',
                volume: 134,
                growth: '+95%',
                priority: 'medium',
                recommendation: 'Atualizar FAQ'
              }
            ].map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.priority === 'high'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    {alert.title}
                  </h3>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      alert.priority === 'high'
                        ? 'bg-red-500 text-white'
                        : 'bg-yellow-500 text-white'
                    }`}
                  >
                    {alert.priority === 'high' ? 'URGENTE' : 'MÉDIO'}
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {alert.volume}
                  </span>
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">
                    {alert.growth}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  💡 {alert.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
