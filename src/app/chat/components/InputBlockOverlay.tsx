'use client';

import { Lock, Star, AlertTriangle } from 'lucide-react';

interface InputBlockOverlayProps {
  pendingFeedbacks: number;
  onUnlock: () => void;
}

export default function InputBlockOverlay({ pendingFeedbacks, onUnlock }: InputBlockOverlayProps) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center backdrop-blur-md bg-white/80 dark:bg-gray-900/80 rounded-[36px] animate-in fade-in duration-300">
      <div className="text-center px-6 py-4 max-w-md">
        {/* Lock icon with pulse */}
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 bg-red-500 rounded-full blur-xl animate-pulse opacity-50" />
          <div className="relative bg-gradient-to-br from-red-500 to-orange-500 rounded-full p-4">
            <Lock className="w-8 h-8 text-white animate-bounce" />
          </div>
        </div>

        {/* Message */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Input Bloqueado
        </h3>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
          Você tem <strong className="text-red-600 dark:text-red-400">{pendingFeedbacks}</strong> {pendingFeedbacks === 1 ? 'avaliação pendente' : 'avaliações pendentes'}
        </p>

        <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
          Avalie as respostas anteriores para continuar
        </p>

        {/* Unlock button */}
        <button
          onClick={onUnlock}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          <Star className="w-5 h-5" />
          Avaliar Agora
          <Star className="w-5 h-5" />
        </button>

        {/* Progress indicator */}
        <div className="mt-4 flex justify-center gap-1">
          {Array.from({ length: Math.min(pendingFeedbacks, 5) }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-red-500 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
