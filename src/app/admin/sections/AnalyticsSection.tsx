'use client';

import { TrendingUp, Clock, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';

interface AnalyticsSectionProps {
  isDarkMode: boolean;
}

export default function AnalyticsSection({ isDarkMode }: AnalyticsSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Analytics Detalhado
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Análises profundas do comportamento organizacional
        </p>
      </div>

      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            📊 Top Assuntos Mais Consultados
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">Últimos 30 dias</span>
        </div>
        <div className="space-y-3">
          {[
            { topic: 'Integrações WhatsApp', count: 456, percent: 28, uneps: ['Plug Chat', 'Z-API', 'Irrah Tech'] },
            { topic: 'Campanhas Automatizadas', count: 398, percent: 24, uneps: ['Z-API', 'GPT Maker'] },
            { topic: 'Configuração de Bots', count: 342, percent: 21, uneps: ['Plug Chat', 'GPT Maker'] },
            { topic: 'Webhooks e APIs', count: 287, percent: 17, uneps: ['Z-API', 'Irrah Tech'] },
            { topic: 'Relatórios e Analytics', count: 165, percent: 10, uneps: ['GPT Maker', 'Kigi'] },
          ].map((item, index) => (
            <div key={index} className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.topic}
                    </p>
                    <div className="flex gap-1 mt-1">
                      {item.uneps.map((unep, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        >
                          {unep}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{item.count}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.percent}%</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-[#FFDE14] dark:to-[#FFEA5F] rounded-full transition-all"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            🏢 Volume de Dúvidas por UNEP
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">Onde treinar mais</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Irrah Tech', count: 345, growth: '+12%', color: 'violet' },
            { name: 'Plug Chat', count: 287, growth: '+8%', color: 'blue' },
            { name: 'Z-API', count: 423, growth: '+25%', color: 'purple' },
            { name: 'GPT Maker', count: 198, growth: '+15%', color: 'pink' },
            { name: 'Kigi', count: 156, growth: '+5%', color: 'cyan' },
            { name: 'Marketing', count: 89, growth: '-3%', color: 'green' },
          ].map((unep, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{unep.name}</h4>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded ${
                    unep.growth.startsWith('+')
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}
                >
                  {unep.growth}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{unep.count}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">perguntas este mês</p>
            </div>
          ))}
        </div>
      </div>

      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            ⏰ Horários de Pico
          </h3>
          <Clock className="w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {[
            { hour: '00h', volume: 5, percent: 2 },
            { hour: '03h', volume: 3, percent: 1 },
            { hour: '06h', volume: 12, percent: 5 },
            { hour: '09h', volume: 145, percent: 60 },
            { hour: '12h', volume: 98, percent: 40 },
            { hour: '15h', volume: 187, percent: 77 },
            { hour: '18h', volume: 134, percent: 55 },
            { hour: '21h', volume: 45, percent: 18 },
          ].map((slot, index) => (
            <div key={index} className="text-center">
              <div className="relative h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-end justify-center p-1 overflow-hidden">
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-cyan-500 dark:from-[#FFDE14] dark:to-[#FFEA5F] transition-all"
                  style={{ height: `${slot.percent}%` }}
                />
                <span className="relative z-10 text-xs font-bold text-gray-900 dark:text-gray-900 mb-1">
                  {slot.volume}
                </span>
              </div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-2">
                {slot.hour}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-gray-900 dark:text-white">
            💡 <strong>Insight:</strong> Pico às 15h (187 perguntas). Considere reforço de equipe neste horário.
          </p>
        </div>
      </div>

      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            🔄 Taxa de Perguntas Repetidas
          </h3>
          <RefreshCw className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {[
            { question: 'Como configurar QR Code Z-API?', count: 42, action: 'Criar documentação urgente' },
            { question: 'Limite de mensagens por dia', count: 38, action: 'Adicionar ao FAQ' },
            { question: 'Integração com CRM', count: 31, action: 'Vídeo tutorial recomendado' },
            { question: 'Erro de autenticação webhook', count: 27, action: 'Guia de troubleshooting' },
          ].map((item, index) => (
            <div
              key={index}
              className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800"
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-white flex-1">
                  {item.question}
                </p>
                <span className="text-lg font-bold text-amber-600 dark:text-amber-400 ml-4">
                  {item.count}×
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                <ArrowRight className="w-3 h-3" />
                <span className="font-medium">{item.action}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            ⚠️ Lacunas de Conhecimento
          </h3>
          <AlertCircle className="w-5 h-5 text-red-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Reformulações</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">156</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">perguntas reformuladas</p>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Mudanças de Agente</p>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">89</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">conversas redirecionadas</p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">"Não Sei"</p>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">34</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">sem contexto</p>
          </div>
        </div>
        <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">
            🎯 Prioridades de Melhoria
          </p>
          <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
            <li>• <strong>API Webhooks Z-API:</strong> 23 "não sei" - Criar base de conhecimento</li>
            <li>• <strong>Planos Kigi:</strong> 18 reformulações - Melhorar prompt do agente</li>
            <li>• <strong>Integrações CRM:</strong> 15 mudanças de agente - Criar agente especializado</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
