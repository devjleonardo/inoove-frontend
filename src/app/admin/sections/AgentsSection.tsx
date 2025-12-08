'use client';

import { useState, useEffect } from 'react';
import { Bot, Upload, FileText, CheckCircle, XCircle, Loader, GraduationCap, RefreshCw } from 'lucide-react';
import { agentService, Agent } from '@/services/agentService';
import { useAuth } from '@/contexts/AuthContext';

interface AgentsSectionProps {
  isDarkMode: boolean;
}

export default function AgentsSection({ isDarkMode }: AgentsSectionProps) {
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  useEffect(() => {
    console.log('User object:', user);
    console.log('gptMakerWorkspaceId:', user?.gptMakerWorkspaceId);
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

  if (selectedAgent) {
    return (
      <TrainingSection
        agent={selectedAgent}
        onBack={() => setSelectedAgent(null)}
        isDarkMode={isDarkMode}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Agentes Disponíveis
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Selecione um agente para treinar com documentos e PDFs
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
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className="group relative p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-[#FFDE14] dark:hover:border-[#FFDE14] transition-all hover:shadow-xl hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 flex-shrink-0 bg-gradient-to-br from-[#FFDE14] to-[#FFEA5F] rounded-lg group-hover:scale-110 transition-transform overflow-hidden flex items-center justify-center">
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
                  <div className="flex-1 text-left min-w-0">
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
                <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 group-hover:text-[#FFDE14] transition-colors">
                    <GraduationCap className="w-4 h-4" />
                    <span className="font-medium">Clique para treinar</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

interface TrainingSectionProps {
  agent: Agent;
  onBack: () => void;
  isDarkMode: boolean;
}

function TrainingSection({ agent, onBack, isDarkMode }: TrainingSectionProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
      setUploadSuccess(false);
      setUploadError(null);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      setIsUploading(true);
      setUploadError(null);
      await agentService.uploadMultipleTraining(agent.id, selectedFiles);
      setUploadSuccess(true);
      setSelectedFiles([]);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      console.error('Erro ao fazer upload:', err);
      setUploadError('Erro ao fazer upload dos arquivos. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Treinar: {agent.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Envie documentos e PDFs para treinar o agente
            </p>
          </div>
        </div>

        {uploadSuccess && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Arquivos enviados com sucesso!
              </span>
            </div>
          </div>
        )}

        {uploadError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                {uploadError}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-[#FFDE14] dark:hover:border-[#FFDE14] transition-colors">
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              <div className="p-4 bg-gradient-to-br from-[#FFDE14] to-[#FFEA5F] rounded-full">
                <Upload className="w-8 h-8 text-gray-900" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  Clique para selecionar arquivos
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Suporta PDF, DOC, DOCX, TXT • Múltiplos arquivos permitidos
                </p>
              </div>
            </label>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Arquivos selecionados ({selectedFiles.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    >
                      <XCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#FFDE14] to-[#FFEA5F] hover:from-[#E6C800] hover:to-[#E6D54A] text-gray-900 font-bold rounded-xl transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Enviar {selectedFiles.length} {selectedFiles.length === 1 ? 'arquivo' : 'arquivos'}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
