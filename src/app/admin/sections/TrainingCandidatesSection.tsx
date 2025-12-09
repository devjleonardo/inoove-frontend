'use client';

import { useState, useEffect } from 'react';
import { Loader, CheckCircle, XCircle, BookOpen, MessageSquare, Calendar, ArrowRight } from 'lucide-react';
import { trainingCandidateService, TrainingCandidate } from '@/services/trainingCandidateService';

interface TrainingCandidatesSectionProps {
  isDarkMode: boolean;
}

export default function TrainingCandidatesSection({ isDarkMode }: TrainingCandidatesSectionProps) {
  const [candidates, setCandidates] = useState<TrainingCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<TrainingCandidate | null>(null);
  const [topic, setTopic] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [convertSuccess, setConvertSuccess] = useState(false);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await trainingCandidateService.listCandidates();
      setCandidates(data);
    } catch (err: any) {
      console.error('Erro ao carregar candidatos:', err);
      setError('Erro ao carregar candidatos de treinamento.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvert = async () => {
    if (!selectedCandidate || !topic.trim()) {
      alert('Por favor, insira um tópico.');
      return;
    }

    try {
      setIsConverting(true);
      await trainingCandidateService.convert(selectedCandidate.id, topic.trim());
      setConvertSuccess(true);
      setShowModal(false);
      setTopic('');
      setSelectedCandidate(null);
      setTimeout(() => setConvertSuccess(false), 3000);
      await loadCandidates(); // Reload list
    } catch (err: any) {
      console.error('Erro ao converter candidato:', err);
      alert('Erro ao converter candidato. Tente novamente.');
    } finally {
      setIsConverting(false);
    }
  };

  const openConvertModal = (candidate: TrainingCandidate) => {
    setSelectedCandidate(candidate);
    setShowModal(true);
    setTopic('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <Loader className="w-6 h-6 animate-spin" />
          <span>Carregando candidatos...</span>
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
          onClick={loadCandidates}
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
              Candidatos de Treinamento
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Conversas pendentes para conversão em material de treinamento
            </p>
          </div>
          <div className="px-4 py-2 bg-gradient-to-r from-[#FFDE14] to-[#FFEA5F] rounded-lg">
            <span className="text-sm font-bold text-gray-900">
              {candidates.length} {candidates.length === 1 ? 'Candidato' : 'Candidatos'}
            </span>
          </div>
        </div>

        {convertSuccess && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Candidato convertido com sucesso!
              </span>
            </div>
          </div>
        )}

        {candidates.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Nenhum candidato pendente no momento.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">
                          Pergunta
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-900 p-3 rounded-lg">
                        {candidate.question}
                      </p>
                    </div>

                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase">
                          Resposta da IA
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 p-3 rounded-lg">
                        {candidate.aiAnswer}
                      </p>
                    </div>

                    
                    <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(candidate.createdAt).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-mono">ID: {candidate.id.substring(0, 8)}...</span>
                      </div>
                    </div>
                  </div>

                  
                  <button
                    onClick={() => openConvertModal(candidate)}
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#FFDE14] to-[#FFEA5F] hover:from-[#E6C800] hover:to-[#E6D54A] text-gray-900 font-bold rounded-xl transition-all hover:shadow-lg"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Converter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      
      {showModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl border-2 border-[#FFDE14]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Converter para Treinamento
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setTopic('');
                  setSelectedCandidate(null);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Defina um tópico para categorizar este material de treinamento.
            </p>

            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Pergunta:</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedCandidate.question}
              </p>
            </div>

            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Digite o tópico (ex: Integração, Configuração, etc.)"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDE14] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleConvert()}
            />

            <div className="flex gap-3">
              <button
                onClick={handleConvert}
                disabled={isConverting || !topic.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#FFDE14] to-[#FFEA5F] hover:from-[#E6C800] hover:to-[#E6D54A] text-gray-900 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isConverting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Convertendo...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Converter
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setTopic('');
                  setSelectedCandidate(null);
                }}
                disabled={isConverting}
                className="px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
