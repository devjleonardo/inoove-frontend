'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Flame,
  DollarSign,
  AlertTriangle,
  Target,
  BarChart3,
  Loader,
  Clock,
  Repeat,
  AlertCircle,
  Layers,
  Recycle,
  BookOpen,
  Users,
  Activity
} from 'lucide-react';
import { intelligenceDashboardService, AskiaIntelligenceDashboardDTO } from '@/services/intelligenceDashboardService';

interface IntelligenceSectionProps {
  isDarkMode: boolean;
}

export default function IntelligenceSection({ isDarkMode }: IntelligenceSectionProps) {
  const [data, setData] = useState<AskiaIntelligenceDashboardDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const dashboard = await intelligenceDashboardService.getIntelligenceDashboard();
      setData(dashboard);
    } catch (err: any) {
      console.error('Erro ao carregar intelligence dashboard:', err);
      setError('Erro ao carregar dados de inteligência.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <Loader className="w-6 h-6 animate-spin" />
          <span>Carregando inteligência organizacional...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
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

  const getMaturityColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-blue-500';
    if (score >= 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPainColor = (score: number) => {
    if (score >= 80) return 'text-red-600 dark:text-red-400';
    if (score >= 60) return 'text-orange-600 dark:text-orange-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Askia Intelligence
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          A plataforma que transforma informação em vantagem competitiva
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Inteligência de Maturidade Operacional
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Entenda a evolução do conhecimento interno por setor, confiança, gaps e reuso
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Score Global:</span>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {(data.maturity.globalScore * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {data.maturity.bySector.map((sector, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900 dark:text-white">{sector.groupName}</span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {(sector.maturityScore * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${getMaturityColor(sector.maturityScore)} transition-all duration-500`}
                  style={{ width: `${sector.maturityScore * 100}%` }}
                />
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Repeat className="w-3 h-3" />
                  <span>Repetição: {(sector.repeatedQuestionsRate * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Baixa Confiança: {(sector.lowConfidenceRate * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  <span>Gaps: {(sector.gapsRate * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Recycle className="w-3 h-3" />
                  <span>Reuso: {(sector.reuseRate * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            💡 A Askia identifica onde cada setor está maduro e onde ainda exige atenção
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Pain Index — Onde estão as maiores dores do time
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">#</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Tópico</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Repetições</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Baixa Conf.</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Gaps</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Score de Dor</th>
              </tr>
            </thead>
            <tbody>
              {data.painIndex.slice(0, 10).map((item, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{index + 1}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{item.topic}</td>
                  <td className="py-3 px-4 text-sm text-center text-gray-700 dark:text-gray-300">{item.repeatedQuestions}</td>
                  <td className="py-3 px-4 text-sm text-center text-gray-700 dark:text-gray-300">{item.lowConfidenceCount}</td>
                  <td className="py-3 px-4 text-sm text-center text-gray-700 dark:text-gray-300">{item.gaps}</td>
                  <td className="py-3 px-4 text-sm text-center">
                    <span className={`font-bold flex items-center justify-center gap-1 ${getPainColor(item.painScore)}`}>
                      <Flame className="w-4 h-4" />
                      {item.painScore.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-900 dark:text-red-200">
            🔥 A Askia quantifica as dores ocultas da operação — e mostra onde agir primeiro
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-8 h-8" />
            <h3 className="text-xl font-bold">Horas Economizadas</h3>
          </div>
          <p className="text-5xl font-bold mb-2">{data.roi.hoursSaved.toFixed(0)}h</p>
          <p className="text-green-100 text-sm">Tempo poupado em resoluções automáticas</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-8 h-8" />
            <h3 className="text-xl font-bold">Economia Estimada</h3>
          </div>
          <p className="text-5xl font-bold mb-2">{formatCurrency(data.roi.costSaved)}</p>
          <p className="text-blue-100 text-sm">Baseado no custo médio dos times</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Recycle className="w-8 h-8" />
            <h3 className="text-xl font-bold">Taxa de Reuso</h3>
          </div>
          <p className="text-5xl font-bold mb-2">{(data.roi.reuseRate * 100).toFixed(0)}%</p>
          <p className="text-purple-100 text-sm">Conhecimento reutilizado com sucesso</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Alertas Inteligentes da Operação
            </h2>
          </div>
        </div>

        <div className="space-y-3">
          {data.alerts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">Nenhum alerta no momento</p>
          ) : (
            data.alerts.map((alert, index) => (
              <div key={index} className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(alert.date).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-900 dark:text-yellow-200">
            ⚠ A Askia detecta anomalias e avisa antes que problemas explodam
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Radar Automático de Treinamentos
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.trainingRadar.map((training, index) => (
            <div key={index} className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{training.topic}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{training.candidates} candidatos</p>
                  <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                    <Users className="w-3 h-3" />
                    <span>{training.suggestedOwner}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <p className="text-sm text-purple-900 dark:text-purple-200">
            🎯 A Askia identifica quando um treinamento precisa existir — automaticamente
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Evolução do Conhecimento Interno
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Mês</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Confiança</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Reuso</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Mensagens</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Gaps +/-</th>
              </tr>
            </thead>
            <tbody>
              {data.evolution.months.map((month, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-700/50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{month.month}</td>
                  <td className="py-3 px-4 text-sm text-center text-gray-700 dark:text-gray-300">
                    {(month.avgConfidence * 100).toFixed(0)}%
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-gray-700 dark:text-gray-300">
                    {(month.reuseRate * 100).toFixed(0)}%
                  </td>
                  <td className="py-3 px-4 text-sm text-center text-gray-700 dark:text-gray-300">
                    {month.totalMessages}
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    <span className={month.gapsCreated > month.gapsResolved ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                      +{month.gapsCreated} / -{month.gapsResolved}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
          <p className="text-sm text-teal-900 dark:text-teal-200">
            📈 Veja como o conhecimento da empresa evolui ao longo do tempo
          </p>
        </div>
      </div>
    </div>
  );
}
