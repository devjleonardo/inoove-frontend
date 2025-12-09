'use client';

import { MessageSquare, Star, AlertCircle } from 'lucide-react';

interface FeedbackBadgeProps {
  pendingCount: number;
  onClick: () => void;
}

export default function FeedbackBadge({ pendingCount, onClick }: FeedbackBadgeProps) {
  if (pendingCount === 0) return null;

  return (
    <button
      onClick={onClick}
      className="absolute -top-3 right-4 z-20 group animate-bounce"
    >
      <div className="relative">
        
        <div className="absolute -inset-2 bg-red-500 rounded-full opacity-75 animate-ping" />
        <div className="absolute -inset-1 bg-red-500 rounded-full opacity-50 animate-pulse" />

        
        <div className="relative bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full px-4 py-2 shadow-2xl flex items-center gap-2 border-2 border-white dark:border-gray-900">
          <AlertCircle className="w-4 h-4 animate-pulse" />
          <span className="text-sm font-bold">
            {pendingCount} {pendingCount === 1 ? 'avaliação' : 'avaliações'} pendente{pendingCount > 1 ? 's' : ''}!
          </span>
          <Star className="w-4 h-4" />
        </div>

        
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-red-500" />
      </div>

      
      <div className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap shadow-xl">
          Clique para avaliar agora! 🎯
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-900 dark:border-b-white" />
        </div>
      </div>
    </button>
  );
}
