'use client';

import { Star, X, ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FeedbackPromptProps {
  trigger: 'after_response' | 'periodic' | 'new_conversation' | 'before_new_chat';
  messageId?: string;
  conversationId: string;
  onSubmit: (rating: number, helpful: boolean, comment?: string) => void;
  onDismiss?: () => void;
  canDismiss?: boolean;
}

export default function FeedbackPrompt({
  trigger,
  messageId,
  conversationId,
  onSubmit,
  onDismiss,
  canDismiss = true
}: FeedbackPromptProps) {
  const [step, setStep] = useState<'rating' | 'helpful' | 'comment' | 'done'>('helpful');
  const [rating, setRating] = useState(0);
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [countdown, setCountdown] = useState(5);
  const [canClose, setCanClose] = useState(canDismiss);

  useEffect(() => {
    if (!canDismiss && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        if (countdown === 1) {
          setCanClose(true);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, canDismiss]);

  const getMessage = () => {
    switch (trigger) {
      case 'after_response':
        return {
          title: '⚡ Avalie esta resposta rapidinho!',
          subtitle: 'Sua opinião nos ajuda a melhorar'
        };
      case 'periodic':
        return {
          title: '📊 Que tal avaliar sua experiência?',
          subtitle: 'Já são 5 perguntas! Como estamos indo?'
        };
      case 'new_conversation':
        return {
          title: '🎯 Antes de começar uma nova conversa...',
          subtitle: 'Como foi a conversa anterior?'
        };
      case 'before_new_chat':
        return {
          title: '⏸️ Um momento!',
          subtitle: 'Avalie rapidamente antes de continuar'
        };
    }
  };

  const handleHelpfulResponse = (isHelpful: boolean) => {
    setHelpful(isHelpful);
    if (isHelpful) {
      setStep('rating');
    } else {
      setStep('comment');
    }
  };

  const handleSubmitFinal = () => {
    onSubmit(rating, helpful || false, comment);
    setStep('done');
    setTimeout(() => {
      onDismiss?.();
    }, 1500);
  };

  const message = getMessage();

  if (step === 'done') {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <ThumbsUp className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Obrigado! 🎉
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Seu feedback nos ajuda a melhorar a cada dia!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md mx-4 shadow-2xl border-4 border-[#FFDE14] dark:border-[#FFDE14] animate-in zoom-in-95 duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {message.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {message.subtitle}
            </p>
          </div>
          {canClose && onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
          {!canClose && countdown > 0 && (
            <div className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full">
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {countdown}s
              </span>
            </div>
          )}
        </div>

        {step === 'helpful' && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
            <p className="text-center text-lg font-semibold text-gray-900 dark:text-white mb-6">
              A resposta foi útil?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleHelpfulResponse(true)}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 hover:shadow-2xl hover:scale-105 transition-all text-white group"
              >
                <ThumbsUp className="w-12 h-12 group-hover:scale-110 transition-transform" />
                <span className="text-lg font-bold">Sim!</span>
                <span className="text-xs opacity-90">Foi muito útil</span>
              </button>
              <button
                onClick={() => handleHelpfulResponse(false)}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 hover:shadow-2xl hover:scale-105 transition-all text-white group"
              >
                <ThumbsDown className="w-12 h-12 group-hover:scale-110 transition-transform" />
                <span className="text-lg font-bold">Não</span>
                <span className="text-xs opacity-90">Preciso melhorar</span>
              </button>
            </div>
          </div>
        )}

        {step === 'rating' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <div>
              <p className="text-center text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Que ótimo! Dê uma nota ⭐
              </p>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
                Como você avalia a qualidade geral?
              </p>
              <div className="flex justify-center gap-3 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="transition-transform hover:scale-125 active:scale-95"
                  >
                    <Star
                      className={`w-12 h-12 transition-colors ${
                        star <= (hoveredStar || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-300 dark:fill-gray-600 text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Quer deixar um comentário? (opcional)"
              className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFDE14] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                onClick={handleSubmitFinal}
                disabled={rating === 0}
                className="flex-1 px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 dark:from-[#FFDE14] dark:to-[#FFEA5F] dark:text-gray-900 rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                Enviar Avaliação
              </button>
              {canClose && (
                <button
                  onClick={() => {
                    onSubmit(rating || 3, true);
                    onDismiss?.();
                  }}
                  className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  Pular
                </button>
              )}
            </div>
          </div>
        )}

        {step === 'comment' && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0" />
              <p className="text-sm text-gray-900 dark:text-white">
                <strong>Poxa! </strong> Conte-nos o que aconteceu para melhorarmos.
              </p>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="O que poderia ser melhor? Seja específico..."
              className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
              rows={4}
              autoFocus
            />
            <button
              onClick={handleSubmitFinal}
              disabled={comment.trim().length < 10}
              className="w-full px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-orange-600 to-red-600 rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar Feedback
            </button>
            {comment.trim().length < 10 && (
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Mínimo 10 caracteres para enviar
              </p>
            )}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${step === 'helpful' ? 'bg-[#FFDE14]' : 'bg-gray-300 dark:bg-gray-600'}`} />
            <div className={`w-2 h-2 rounded-full ${step === 'rating' || step === 'comment' ? 'bg-[#FFDE14]' : 'bg-gray-300 dark:bg-gray-600'}`} />
            <div className={`w-2 h-2 rounded-full ${step === 'done' ? 'bg-[#FFDE14]' : 'bg-gray-300 dark:bg-gray-600'}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
