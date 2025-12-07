'use client';

import { ThumbsUp, ThumbsDown, Flag } from 'lucide-react';
import { useState } from 'react';

interface MessageFeedbackProps {
  messageId: string;
  onFeedback: (messageId: string, type: 'positive' | 'negative' | 'report', comment?: string) => void;
}

export default function MessageFeedback({ messageId, onFeedback }: MessageFeedbackProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<'positive' | 'negative' | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [comment, setComment] = useState('');
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);

  const issues = [
    'Resposta incorreta',
    'Informação incompleta',
    'Não entendeu minha pergunta',
    'Resposta muito técnica',
    'Resposta muito genérica',
    'Link/recurso não funciona',
    'Outro'
  ];

  const handleFeedback = (type: 'positive' | 'negative') => {
    setSelectedFeedback(type);

    if (type === 'positive') {
      onFeedback(messageId, 'positive');
    } else {
      setShowDetailModal(true);
    }
  };

  const handleSubmitDetail = () => {
    onFeedback(messageId, 'negative', JSON.stringify({
      issues: selectedIssues,
      comment: comment
    }));
    setShowDetailModal(false);
    setComment('');
    setSelectedIssues([]);
  };

  const toggleIssue = (issue: string) => {
    setSelectedIssues(prev =>
      prev.includes(issue)
        ? prev.filter(i => i !== issue)
        : [...prev, issue]
    );
  };

  if (showDetailModal) {
    return (
      <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="mb-3">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            O que poderia ser melhor?
          </p>
          <div className="flex flex-wrap gap-2">
            {issues.map((issue) => (
              <button
                key={issue}
                onClick={() => toggleIssue(issue)}
                className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                  selectedIssues.includes(issue)
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {issue}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 block">
            Comentário adicional (opcional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Descreva o problema ou sugestão..."
            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#FFDE14] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSubmitDetail}
            disabled={selectedIssues.length === 0}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-[#FFDE14] dark:text-gray-900 rounded-lg hover:bg-blue-700 dark:hover:bg-[#E6C800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar Feedback
          </button>
          <button
            onClick={() => {
              setShowDetailModal(false);
              setSelectedFeedback(null);
              setComment('');
              setSelectedIssues([]);
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <button
        onClick={() => handleFeedback('positive')}
        disabled={selectedFeedback !== null}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
          selectedFeedback === 'positive'
            ? 'bg-green-500 text-white shadow-lg scale-105'
            : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 hover:scale-105 border border-green-200 dark:border-green-800'
        } disabled:cursor-not-allowed disabled:opacity-50`}
        title="Resposta útil"
      >
        <ThumbsUp className="w-4 h-4" />
        <span className="hidden sm:inline">Útil</span>
      </button>

      <button
        onClick={() => handleFeedback('negative')}
        disabled={selectedFeedback !== null}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
          selectedFeedback === 'negative'
            ? 'bg-red-500 text-white shadow-lg scale-105'
            : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:scale-105 border border-red-200 dark:border-red-800'
        } disabled:cursor-not-allowed disabled:opacity-50`}
        title="Resposta não útil"
      >
        <ThumbsDown className="w-4 h-4" />
        <span className="hidden sm:inline">Não útil</span>
      </button>

      <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

      <button
        onClick={() => onFeedback(messageId, 'report')}
        className="p-2 rounded-lg text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all hover:scale-105 border border-orange-200 dark:border-orange-800"
        title="Reportar problema"
      >
        <Flag className="w-4 h-4" />
      </button>

      {selectedFeedback === 'positive' && (
        <span className="text-xs text-green-600 dark:text-green-400 font-medium animate-in fade-in slide-in-from-left-2 duration-300 ml-2">
          ✨ Obrigado pelo feedback!
        </span>
      )}
    </div>
  );
}
