'use client';

import { Flame, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface HeatmapData {
  topic: string;
  uneps: {
    [key: string]: {
      level: 'low' | 'medium' | 'high';
      volume: number;
      trend: 'up' | 'down' | 'stable';
    };
  };
}

interface KnowledgeHeatmapProps {
  isDarkMode: boolean;
}

export default function KnowledgeHeatmap({ isDarkMode }: KnowledgeHeatmapProps) {
  const uneps = ['Irrah Tech', 'Plug Chat', 'Z-API', 'GPT Maker', 'Kigi'];

  const heatmapData: HeatmapData[] = [
    {
      topic: 'Integrações WhatsApp',
      uneps: {
        'Irrah Tech': { level: 'high', volume: 245, trend: 'up' },
        'Plug Chat': { level: 'high', volume: 189, trend: 'stable' },
        'Z-API': { level: 'medium', volume: 67, trend: 'down' },
        'GPT Maker': { level: 'low', volume: 23, trend: 'stable' },
        'Kigi': { level: 'medium', volume: 45, trend: 'up' },
      },
    },
    {
      topic: 'Campanhas Automatizadas',
      uneps: {
        'Irrah Tech': { level: 'medium', volume: 134, trend: 'stable' },
        'Plug Chat': { level: 'low', volume: 28, trend: 'down' },
        'Z-API': { level: 'high', volume: 312, trend: 'up' },
        'GPT Maker': { level: 'medium', volume: 89, trend: 'up' },
        'Kigi': { level: 'low', volume: 15, trend: 'stable' },
      },
    },
    {
      topic: 'Webhooks e APIs',
      uneps: {
        'Irrah Tech': { level: 'high', volume: 198, trend: 'up' },
        'Plug Chat': { level: 'medium', volume: 76, trend: 'stable' },
        'Z-API': { level: 'high', volume: 201, trend: 'up' },
        'GPT Maker': { level: 'low', volume: 34, trend: 'down' },
        'Kigi': { level: 'medium', volume: 54, trend: 'stable' },
      },
    },
    {
      topic: 'Configurações de Bot',
      uneps: {
        'Irrah Tech': { level: 'low', volume: 42, trend: 'down' },
        'Plug Chat': { level: 'high', volume: 223, trend: 'up' },
        'Z-API': { level: 'medium', volume: 98, trend: 'stable' },
        'GPT Maker': { level: 'high', volume: 187, trend: 'up' },
        'Kigi': { level: 'medium', volume: 67, trend: 'stable' },
      },
    },
    {
      topic: 'Planos e Pagamentos',
      uneps: {
        'Irrah Tech': { level: 'medium', volume: 112, trend: 'stable' },
        'Plug Chat': { level: 'medium', volume: 145, trend: 'up' },
        'Z-API': { level: 'low', volume: 56, trend: 'down' },
        'GPT Maker': { level: 'medium', volume: 98, trend: 'stable' },
        'Kigi': { level: 'high', volume: 234, trend: 'up' },
      },
    },
    {
      topic: 'Relatórios e Analytics',
      uneps: {
        'Irrah Tech': { level: 'medium', volume: 87, trend: 'up' },
        'Plug Chat': { level: 'low', volume: 34, trend: 'stable' },
        'Z-API': { level: 'medium', volume: 91, trend: 'up' },
        'GPT Maker': { level: 'high', volume: 156, trend: 'up' },
        'Kigi': { level: 'low', volume: 29, trend: 'down' },
      },
    },
  ];

  const getHeatColor = (level: 'low' | 'medium' | 'high') => {
    if (isDarkMode) {
      switch (level) {
        case 'low':
          return 'bg-green-900/40 border-green-500/30 text-green-400';
        case 'medium':
          return 'bg-yellow-900/40 border-yellow-500/30 text-yellow-400';
        case 'high':
          return 'bg-red-900/40 border-red-500/30 text-red-400';
      }
    } else {
      switch (level) {
        case 'low':
          return 'bg-green-100 border-green-300 text-green-700';
        case 'medium':
          return 'bg-yellow-100 border-yellow-300 text-yellow-700';
        case 'high':
          return 'bg-red-100 border-red-300 text-red-700';
      }
    }
  };

  const getFlameCount = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return 1;
      case 'medium':
        return 2;
      case 'high':
        return 3;
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3" />;
      case 'down':
        return <TrendingDown className="w-3 h-3" />;
      case 'stable':
        return <Minus className="w-3 h-3" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Mapa de Calor de Conhecimento
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Visualize gaps de conhecimento por UNEP e tema
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex">
            <Flame className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Baixo Volume</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex">
            <Flame className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <Flame className="w-4 h-4 text-yellow-600 dark:text-yellow-400 -ml-1" />
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Volume Médio</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex">
            <Flame className="w-4 h-4 text-red-600 dark:text-red-400" />
            <Flame className="w-4 h-4 text-red-600 dark:text-red-400 -ml-1" />
            <Flame className="w-4 h-4 text-red-600 dark:text-red-400 -ml-1" />
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Alto Volume (Atenção!)</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300 dark:border-gray-600">
              <th className="text-left p-3 text-sm font-bold text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-800 z-10">
                Tema
              </th>
              {uneps.map((unep) => (
                <th
                  key={unep}
                  className="text-center p-3 text-xs font-bold text-gray-900 dark:text-white min-w-[140px]"
                >
                  {unep}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatmapData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
              >
                <td className="p-3 text-sm font-semibold text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-800 z-10">
                  {row.topic}
                </td>
                {uneps.map((unep) => {
                  const data = row.uneps[unep];
                  return (
                    <td key={unep} className="p-2">
                      <div
                        className={`relative group flex flex-col items-center justify-center p-3 rounded-lg border transition-all hover:scale-105 hover:shadow-lg ${getHeatColor(
                          data.level
                        )}`}
                      >
                        <div className="flex mb-1">
                          {Array.from({ length: getFlameCount(data.level) }).map((_, i) => (
                            <Flame
                              key={i}
                              className={`w-4 h-4 ${
                                data.level === 'high'
                                  ? 'text-red-600 dark:text-red-400'
                                  : data.level === 'medium'
                                  ? 'text-yellow-600 dark:text-yellow-400'
                                  : 'text-green-600 dark:text-green-400'
                              } ${i > 0 ? '-ml-1' : ''}`}
                            />
                          ))}
                        </div>

                        <div className="text-lg font-bold mb-0.5">{data.volume}</div>

                        <div
                          className={`flex items-center justify-center ${
                            data.trend === 'up'
                              ? 'text-red-600 dark:text-red-400'
                              : data.trend === 'down'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {getTrendIcon(data.trend)}
                        </div>

                        <div className="absolute bottom-full mb-2 hidden group-hover:block z-20">
                          <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-xl">
                            <div className="font-bold mb-1">{unep}</div>
                            <div>Volume: {data.volume} perguntas</div>
                            <div>
                              Tendência:{' '}
                              {data.trend === 'up'
                                ? '↑ Crescendo'
                                : data.trend === 'down'
                                ? '↓ Diminuindo'
                                : '→ Estável'}
                            </div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                              <div className="border-4 border-transparent border-t-gray-900 dark:border-t-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">💡 Insights Automáticos</h3>
        <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
          <li>• <strong>Z-API</strong> precisa de treinamento urgente em <strong>Campanhas Automatizadas</strong> (312 perguntas, ↑ crescimento)</li>
          <li>• <strong>Plug Chat</strong> demonstra alto domínio em <strong>Configurações de Bot</strong> (223 perguntas resolvidas)</li>
          <li>• <strong>Kigi</strong> tem gap crítico em <strong>Campanhas Automatizadas</strong> (apenas 15 perguntas, baixo engajamento)</li>
        </ul>
      </div>
    </div>
  );
}
