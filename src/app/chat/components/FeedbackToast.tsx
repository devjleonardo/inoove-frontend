'use client';

import { MessageSquare, X, Star, ThumbsUp, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FeedbackToastProps {
  message: string;
  type: 'reminder' | 'urgent' | 'achievement';
  onAction: () => void;
  onDismiss?: () => void;
  persistent?: boolean;
  actionLabel?: string;
}

export default function FeedbackToast({
  message,
  type,
  onAction,
  onDismiss,
  persistent = true,
  actionLabel = 'Avaliar Agora'
}: FeedbackToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [shake, setShake] = useState(false);

  // Shake animation every 10 seconds to catch attention
  useEffect(() => {
    if (!persistent) return;

    const interval = setInterval(() => {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }, 10000);

    return () => clearInterval(interval);
  }, [persistent]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const getStyle = () => {
    switch (type) {
      case 'urgent':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-orange-500',
          border: 'border-red-600',
          icon: MessageSquare,
          iconColor: 'text-white',
          textColor: 'text-white'
        };
      case 'achievement':
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
          border: 'border-green-600',
          icon: Star,
          iconColor: 'text-white',
          textColor: 'text-white'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-[#FFDE14] to-[#FFEA5F]',
          border: 'border-[#E6C800]',
          icon: ThumbsUp,
          iconColor: 'text-gray-900',
          textColor: 'text-gray-900'
        };
    }
  };

  const style = getStyle();
  const Icon = style.icon;

  return (
    <div
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-500 ${
        shake ? 'animate-shake' : ''
      }`}
    >
      <div className={`${style.bg} rounded-2xl shadow-2xl border-2 ${style.border} p-4 max-w-md min-w-[320px] relative overflow-hidden`}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10"
             style={{
               backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)',
               animation: 'slide 20s linear infinite'
             }}
        />

        {/* Pulse rings */}
        {persistent && type === 'urgent' && (
          <>
            <div className="absolute -inset-2 border-2 border-white rounded-2xl animate-ping opacity-75" />
            <div className="absolute -inset-4 border-2 border-white rounded-2xl animate-ping opacity-50" style={{ animationDelay: '0.5s' }} />
          </>
        )}

        <div className="relative flex items-start gap-3">
          {/* Icon with pulse */}
          <div className="flex-shrink-0">
            <div className="relative">
              {persistent && (
                <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75" />
              )}
              <div className="relative bg-white/20 backdrop-blur-sm rounded-full p-2">
                <Icon className={`w-5 h-5 ${style.iconColor}`} />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <p className={`text-sm font-bold ${style.textColor} mb-2 leading-snug`}>
              {message}
            </p>

            {/* Action button */}
            <button
              onClick={onAction}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg font-bold text-sm hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              {actionLabel}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Close button (only if not persistent or dismissable) */}
          {(!persistent || onDismiss) && (
            <button
              onClick={handleDismiss}
              className={`flex-shrink-0 p-1 rounded-lg hover:bg-white/20 transition-colors ${style.textColor}`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Persistent indicator */}
        {persistent && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
            <div className="h-full bg-white animate-pulse" />
          </div>
        )}
      </div>

      {/* Helper text */}
      {persistent && type === 'urgent' && (
        <div className="mt-2 text-center animate-in fade-in duration-500" style={{ animationDelay: '1s' }}>
          <p className="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-full inline-block shadow-lg">
            ⚠️ Avalie para continuar conversando
          </p>
        </div>
      )}
    </div>
  );
}
