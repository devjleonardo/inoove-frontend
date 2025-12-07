'use client';

import { DollarSign, TrendingDown, TrendingUp, Cpu, Zap, AlertTriangle } from 'lucide-react';

interface CostsSectionProps {
  isDarkMode: boolean;
}

export default function CostsSection({ isDarkMode }: CostsSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Custos & Tokens
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Controle financeiro e otimização de gastos com IA
        </p>
      </div>

      {/* Overview Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Este mês</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Custo Total</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">$284.50</p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">-12% vs mês anterior</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Cpu className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">GPT Maker</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Créditos Usados</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">1,234</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">de 5,000 disponíveis</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">OpenAI</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tokens Processados</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">2.4M</p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">~$0.96 em tokens</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <TrendingDown className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Economia</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Custo por Conversa</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">$0.23</p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">-18% este mês</p>
        </div>
      </div>

      {/* Detalhamento de Custos por Agente */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            💰 Custo por Agente (Tokens)
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">Últimos 30 dias</span>
        </div>
        <div className="space-y-4">
          {[
            {
              name: 'Agente Z-API',
              tokens: '842K',
              cost: 84.2,
              percent: 35,
              trend: 'up',
              conversations: 423,
              avgPerConv: '$0.20'
            },
            {
              name: 'Agente Plug Chat',
              tokens: '658K',
              cost: 65.8,
              percent: 27,
              trend: 'stable',
              conversations: 287,
              avgPerConv: '$0.23'
            },
            {
              name: 'Agente GPT Maker',
              tokens: '487K',
              cost: 48.7,
              percent: 20,
              trend: 'down',
              conversations: 198,
              avgPerConv: '$0.25'
            },
            {
              name: 'Agente Irrah Tech',
              tokens: '356K',
              cost: 35.6,
              percent: 15,
              trend: 'up',
              conversations: 345,
              avgPerConv: '$0.10'
            },
            {
              name: 'Agente Kigi',
              tokens: '73K',
              cost: 7.3,
              percent: 3,
              trend: 'stable',
              conversations: 156,
              avgPerConv: '$0.05'
            },
          ].map((agent, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-[#FFDE14] dark:to-[#FFEA5F] rounded-lg flex items-center justify-center text-white dark:text-gray-900 font-bold text-sm">
                    {agent.name.charAt(7)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{agent.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {agent.tokens} tokens • {agent.conversations} conversas
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    ${agent.cost.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-1 justify-end">
                    <span className="text-xs text-gray-600 dark:text-gray-400">{agent.avgPerConv}/conv</span>
                    {agent.trend === 'up' && (
                      <TrendingUp className="w-3 h-3 text-red-500" />
                    )}
                    {agent.trend === 'down' && (
                      <TrendingDown className="w-3 h-3 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
              <div className="relative h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  style={{ width: `${agent.percent}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {agent.percent}% do custo total
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* GPT Maker - Créditos vs Tokens */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            🎯 GPT Maker: Créditos vs Tokens
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Créditos */}
          <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
              💳 Sistema de Créditos
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">Créditos Usados:</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">Créditos Restantes:</span>
                <span className="text-sm font-bold text-green-600 dark:text-green-400">3,766</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">Total Disponível:</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">5,000</span>
              </div>
              <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-4">
                <div
                  className="absolute h-full bg-gradient-to-r from-purple-500 to-blue-500 dark:from-[#FFDE14] dark:to-[#FFEA5F] rounded-full"
                  style={{ width: '24.68%' }}
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                24.68% consumido • Renovação em 12 dias
              </p>
            </div>
          </div>

          {/* Tokens OpenAI */}
          <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
              ⚡ Tokens OpenAI
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">Tokens Processados:</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">2.4M</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">Máx. por Resposta:</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">5,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">Modelo:</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">GPT-4.1-mini</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-gray-600 dark:text-gray-400">Custo Estimado:</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">$0.96</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                $0.40 / 1M tokens (sem cache)
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-gray-900 dark:text-white">
            💡 <strong>Nota Importante:</strong> O custo de créditos do GPT Maker é independente dos tokens OpenAI.
            1 crédito = 1 resposta, independentemente do tamanho (até 5K tokens).
          </p>
        </div>
      </div>

      {/* Projeções e Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Projeção de Gastos */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Projeção Mensal
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Gasto Atual (21 dias)</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">$284.50</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Projeção 30 dias</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">$406.43</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-xs text-green-700 dark:text-green-400">
                ✅ Dentro do orçamento ($500/mês)
              </p>
            </div>
          </div>
        </div>

        {/* Alertas de Otimização */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Oportunidades
            </h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-xs font-bold text-gray-900 dark:text-white mb-1">
                Agente Z-API alto custo
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                $0.20/conversa. Considere otimizar prompts.
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs font-bold text-gray-900 dark:text-white mb-1">
                Habilitar cache OpenAI
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Economia estimada: 50% em tokens repetidos.
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-xs font-bold text-gray-900 dark:text-white mb-1">
                Revisar max_tokens
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                70% das respostas usam menos de 2K tokens.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ROI e Economia */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-xl p-6 border border-green-200 dark:border-green-800">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          💰 Retorno sobre Investimento (ROI)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Custo Mensal Askia</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">$406</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Horas Economizadas</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">280h</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Economia Gerada</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">$8,400</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">@ $30/hora</p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
          <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            ROI: 1,968%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Para cada $1 investido na Askia, a empresa economiza <strong>$19.68</strong> em custos de suporte humano.
          </p>
        </div>
      </div>
    </div>
  );
}
