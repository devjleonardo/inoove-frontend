'use client';

import { User, Sparkles, Zap, Brain, Copy, Check, Clock, CheckCheck, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import MessageFeedback from './MessageFeedback';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  isDarkMode: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onMessageFeedback?: (messageId: string, type: 'positive' | 'negative' | 'report', comment?: string) => void;
}

export default function MessageList({ messages, isLoading, isDarkMode, messagesEndRef, onMessageFeedback }: MessageListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const lastAssistantIndex = messages.reduce((lastIndex, msg, currentIndex) => {
    return msg.role === 'assistant' ? currentIndex : lastIndex;
  }, -1);

  const isPreviousAssistant = (index: number) => {
    return index > 0 && messages[index - 1]?.role === 'assistant';
  };

  const isFirstInGroup = (index: number, role: string) => {
    if (role === 'user') return true;
    return !isPreviousAssistant(index);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 pb-28">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} ${
            isPreviousAssistant(index) && message.role === 'assistant' ? 'mt-2' : 'mt-6'
          }`}
        >
          <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {isFirstInGroup(index, message.role) && (
              <div className="flex-shrink-0 mt-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gray-600 dark:bg-[#FFDE14]'
                      : 'bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <Image
                      src={isDarkMode ? "/askia/ASKIA_03.png" : "/askia/ASKIA_04.png"}
                      alt="ASKIA"
                      width={22}
                      height={22}
                      className="object-contain"
                    />
                  ) : (
                    <User className="w-5 h-5 text-white dark:text-black" />
                  )}
                </div>
              </div>
            )}

            {!isFirstInGroup(index, message.role) && message.role === 'assistant' && (
              <div className="w-9 flex-shrink-0" />
            )}

            <div className="flex flex-col gap-1 flex-1">
              {isFirstInGroup(index, message.role) && (
                <div className={`flex items-center gap-2 mb-1 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-[11px] text-gray-900 dark:text-gray-400 font-semibold">
                    {message.timestamp instanceof Date
                      ? message.timestamp.toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : new Date(message.timestamp).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                    }
                  </span>
                </div>
              )}

              <div
                className={`relative px-5 py-3 rounded-2xl shadow-sm ${
                  message.role === 'user'
                    ? 'bg-gray-900 dark:bg-[#FFDE14] text-white dark:text-black'
                    : 'bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700/50'
                }`}
              >
                {message.role === 'assistant' && (
                  <button
                    onClick={() => handleCopy(message.id, message.content)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors opacity-60 hover:opacity-100"
                    title={copiedId === message.id ? 'Copiado!' : 'Copiar mensagem'}
                  >
                    {copiedId === message.id ? (
                      <Check className="w-4 h-4 text-green-700 dark:text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-700 dark:text-gray-400" />
                    )}
                  </button>
                )}
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap pr-8">
                  {message.content}
                </p>
              </div>
              {message.role === 'assistant' && onMessageFeedback && index === lastAssistantIndex && (
                <MessageFeedback
                  messageId={message.id}
                  onFeedback={onMessageFeedback}
                />
              )}
            </div>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex gap-3 max-w-[80%]">
            <div className="flex-shrink-0 mt-1">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600">
                <Image
                  src={isDarkMode ? "/askia/ASKIA_03.png" : "/askia/ASKIA_04.png"}
                  alt="ASKIA"
                  width={22}
                  height={22}
                  className="object-contain"
                />
              </div>
            </div>

            <div className="px-5 py-3 rounded-2xl shadow-sm bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-700/50">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-700 dark:text-gray-300 mr-2">ASKIA está digitando</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-[#FFDE14] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-[#FFDE14] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-[#FFDE14] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
