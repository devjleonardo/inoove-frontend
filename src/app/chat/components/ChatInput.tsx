'use client';

import { Send } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export default function ChatInput({ input, isLoading, onInputChange, onSubmit, inputRef }: ChatInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200); // Max 200px
      textarea.style.height = `${newHeight}px`;
    }
  }, [input]);

  return (
    <div className="p-6 relative">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={onSubmit} className="relative">
          {/* Container principal limpo */}
          <div className="relative flex items-end gap-3 px-6 py-3 rounded-3xl bg-[#222222] dark:bg-[#1a1a1a] border-2 border-gray-800 dark:border-[#FFDE14]/40 shadow-lg transition-all duration-200">

            {/* Input limpo */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onSubmit(e);
                  }
                }}
                placeholder="Pergunte algo à ASKIA..."
                disabled={isLoading}
                rows={1}
                className="w-full px-2 py-0 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm disabled:opacity-50 resize-none overflow-y-auto max-h-[200px] leading-normal"
                aria-label="Digite sua mensagem"
                style={{ minHeight: '24px', height: '24px' }}
              />
            </div>

            {/* Botão de envio */}
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-full bg-[#FFDE14] hover:bg-[#E6C800] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Enviar mensagem"
            >
              <Send className="w-5 h-5 text-black" />
            </button>
          </div>
        </form>

        {/* Rodapé com aviso */}
        <div className="mt-3 flex items-center justify-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-black/50 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              A ASKIA pode cometer erros. Verifique informações importantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
