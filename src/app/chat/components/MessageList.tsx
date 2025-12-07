'use client';

import { User, Sparkles, Zap, Brain } from 'lucide-react';
import Image from 'next/image';
import MessageFeedback from './MessageFeedback';

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
  onMessageFeedback?: (messageId: string, type: 'positive' | 'negative' | 'report', comment?: string) => void;
}

export default function MessageList({ messages, isLoading, isDarkMode, messagesEndRef, onMessageFeedback }: MessageListProps) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
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

            <div className="flex flex-col gap-1 flex-1">
              <div
                className={`px-5 py-3 rounded-2xl shadow-sm ${
                  message.role === 'user'
                    ? 'bg-gray-600 dark:bg-[#FFDE14] text-white dark:text-black'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                }`}
              >
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
              <div className={`flex items-center gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <span className={`text-[11px] text-gray-400 dark:text-gray-500 px-2`}>
                  {message.timestamp instanceof Date
                    ? message.timestamp.toLocaleString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : new Date(message.timestamp).toLocaleString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                  }
                </span>
              </div>
              {message.role === 'assistant' && onMessageFeedback && (
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
        <div className="flex justify-start">
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

            <div className="px-5 py-3 rounded-2xl shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full" />
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full" />
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
