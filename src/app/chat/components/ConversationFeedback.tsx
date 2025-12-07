'use client';

import { CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface ConversationFeedbackProps {
  conversationId: string;
  trigger: 'gratitude' | 'multiple_exchanges' | 'reformulation' | 'manual';
  onFeedback: (conversationId: string, resolved: boolean, rating?: number, comment?: string) => void;
  onDismiss: () => void;
}

export default function ConversationFeedback({
  conversationId,
  trigger,
  onFeedback,
  onDismiss
}: ConversationFeedbackProps) {
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  const getTriggerMessage = () => {
    switch (trigger) {
      case 'gratitude':
        return 'Fico feliz em ajudar! Consegui resolver sua dúvida?';
      case 'multiple_exchanges':
        return 'Estou conseguindo ajudar você?';
      case 'reformulation':
        return 'Desculpe, parece que não estou entendendo bem. Posso te ajudar de outra forma?';
      default:
        return 'Como foi sua experiência com a Askia?';
    }
  };

  const handleResolved = (resolved: boolean) => {
    if (resolved) {
      setShowRating(true);
    } else {
      onFeedback(conversationId, false);
      onDismiss();
    }
  };

  const handleSubmitRating = () => {
    onFeedback(conversationId, true, rating, comment);
    onDismiss();
  };

  if (showRating) {
    return (
      <div className="my-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3 text-center">
          Que ótimo! Como você avalia sua experiência? ⭐
        </p>

        {/* Star Rating */}
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="transition-transform hover:scale-110 active:scale-95"
            >
              <svg
                className={`w-8 h-8 transition-colors ${
                  star <= (hoveredStar || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-300 dark:fill-gray-600 text-gray-300 dark:text-gray-600'
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          ))}
        </div>

        {rating > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Quer deixar um comentário? (opcional)"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#FFDE14] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none mb-3"
              rows={2}
            />

            <div className="flex gap-2">
              <button
                onClick={handleSubmitRating}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 dark:from-[#FFDE14] dark:to-[#FFEA5F] dark:text-gray-900 rounded-lg hover:shadow-lg transition-all"
              >
                Enviar Avaliação
              </button>
              <button
                onClick={onDismiss}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Pular
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="my-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-blue-200 dark:border-gray-600 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start gap-3">
        <MessageCircle className="w-5 h-5 text-blue-600 dark:text-[#FFDE14] flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            {getTriggerMessage()}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => handleResolved(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg hover:shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <CheckCircle className="w-4 h-4" />
              Sim, resolveu!
            </button>

            <button
              onClick={() => handleResolved(false)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-all"
            >
              <XCircle className="w-4 h-4" />
              Ainda preciso de ajuda
            </button>
          </div>

          <button
            onClick={onDismiss}
            className="w-full mt-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            Dispensar
          </button>
        </div>
      </div>
    </div>
  );
}
