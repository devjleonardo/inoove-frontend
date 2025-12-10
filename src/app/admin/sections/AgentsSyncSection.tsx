'use client';

import { useState, useEffect } from 'react';
import { Bot, Loader, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { agentService, Agent } from '@/services/v1/agentService';
import { useAuth } from '@/contexts/AuthContext';

interface AgentsSyncSectionProps {
  isDarkMode: boolean;
}

export default function AgentsSyncSection({ isDarkMode }: AgentsSyncSectionProps) {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await agentService.listAgents();
      setAgents(data);
    } catch (err: any) {
      console.error('Erro ao carregar agentes:', err);
      setError('Erro ao carregar agentes. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    if (!user?.gptMakerWorkspaceId) {
      alert('Workspace ID não configurado para este usuário.');
      return;
    }

    try {
      setIsSyncing(true);
      const syncedAgents = await agentService.syncAgents(user.gptMakerWorkspaceId);
      setAgents(syncedAgents);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch (err: any) {
      console.error('Erro ao sincronizar agentes:', err);
      alert('Erro ao sincronizar agentes. Tente novamente.');
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <Loader className="w-6 h-6 animate-spin" />
          <span>Carregando agentes...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          <div>
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">Erro</h3>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
        <button
          onClick={loadAgents}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Agentes Sincronizados
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Agentes disponíveis do GPT Maker
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSync}
              disabled={isSyncing || !user?.gptMakerWorkspaceId}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              title={!user?.gptMakerWorkspaceId ? 'Workspace ID não configurado' : 'Sincronizar agentes do GPT Maker'}
            >
              {isSyncing ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Sincronizar GPT Maker
                </>
              )}
            </button>
            <div className="px-4 py-2 bg-gradient-to-r from-[#FFDE14] to-[#FFEA5F] rounded-lg">
              <span className="text-sm font-bold text-gray-900">
                {agents.length} {agents.length === 1 ? 'Agente' : 'Agentes'}
              </span>
            </div>
          </div>
        </div>

        {syncSuccess && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Agentes sincronizados com sucesso!
              </span>
            </div>
          </div>
        )}

        {agents.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Nenhum agente disponível no momento.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Clique em "Sincronizar GPT Maker" para importar agentes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="group relative p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-[#FFDE14] dark:hover:border-[#FFDE14] transition-all hover:shadow-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 flex-shrink-0 bg-gradient-to-br from-[#FFDE14] to-[#FFEA5F] rounded-lg transition-transform overflow-hidden flex items-center justify-center">
                    {agent.avatarUrl ? (
                      <img
                        src={agent.avatarUrl}
                        alt={agent.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <Bot className={`w-7 h-7 text-gray-900 ${agent.avatarUrl ? 'hidden' : ''}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
                      {agent.name}
                    </h3>
                    {agent.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {agent.description}
                      </p>
                    )}
                    {(agent.unep || agent.businessUnit) && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {agent.unep && (
                          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                            {agent.unep}
                          </span>
                        )}
                        {agent.businessUnit && (
                          <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">
                            {agent.businessUnit}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
