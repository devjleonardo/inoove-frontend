'use client';

import { User } from 'lucide-react';
import Image from 'next/image';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  isDarkMode: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function MessageList({ messages, isLoading, isDarkMode, messagesEndRef }: MessageListProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          } animate-in fade-in slide-in-from-bottom-4 duration-500`}
        >
          <div className={`flex gap-4 max-w-[90%] md:max-w-[48%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="relative flex-shrink-0">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                  message.role === 'user'
                    ? 'bg-white dark:bg-gray-800'
                    : 'bg-white dark:bg-gray-800'
                }`}
              >
                {message.role === 'assistant' ? (
                  <Image
                    src={isDarkMode ? "/askia/ASKIA_03.png" : "/askia/ASKIA_04.png"}
                    alt="ASKIA"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-900 dark:text-white" />
                )}
              </div>
              {message.role === 'assistant' && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-black" />
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <div className={`flex items-center gap-2 mb-2 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <span className="font-bold text-sm text-gray-900 dark:text-white">
                  {message.role === 'assistant' ? 'ASKIA' : 'Você'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
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

              <div
                className={`p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-gray-900 dark:bg-[#FFDE14] text-white dark:text-black'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                } shadow-lg inline-block`}
              >
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex gap-4 max-w-[90%] md:max-w-[48%]">
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-2 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 dark:from-[#FFDE14] dark:via-[#FFEA5F] dark:to-[#FFDE14] rounded-xl opacity-60 blur-lg animate-pulse-slow" />
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-white dark:bg-gray-800 relative z-10 animate-float">
                <Image
                  src={isDarkMode ? "/askia/ASKIA_03.png" : "/askia/ASKIA_04.png"}
                  alt="ASKIA"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-sm text-gray-900 dark:text-white animate-pulse">ASKIA</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <span className="animate-pulse">digitando</span>
                  <span className="flex gap-0.5">
                    <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                  </span>
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg inline-block relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-900/10 dark:via-[#FFDE14]/20 to-transparent animate-shimmer" />
                <div className="flex gap-2 relative z-10">
                  <div className="w-2.5 h-2.5 bg-gray-900 dark:bg-[#FFDE14] rounded-full animate-bounce" />
                  <div className="w-2.5 h-2.5 bg-gray-900 dark:bg-[#FFDE14] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2.5 h-2.5 bg-gray-900 dark:bg-[#FFDE14] rounded-full animate-bounce [animation-delay:0.4s]" />
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
