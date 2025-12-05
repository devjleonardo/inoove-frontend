'use client';

import { Plus, Mic, ArrowRight, Sparkles, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export default function ChatInput({ input, isLoading, onInputChange, onSubmit, inputRef }: ChatInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Gerar partículas aleatórias para o efeito de fundo
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="p-6 relative">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={onSubmit} className="relative group">
          {/* Partículas de fundo animadas */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[32px]">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute w-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-[#FFDE14] dark:to-[#FFEA5F] rounded-full opacity-30 animate-float"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  animationDelay: `${particle.delay}s`,
                }}
              />
            ))}
          </div>

          {/* Borda animada com múltiplas camadas */}
          <div className="absolute -inset-[2px] rounded-[32px] bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 dark:from-[#FFDE14] dark:via-[#FFEA5F] dark:to-[#FFD700] opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />

          <div
            className={`absolute -inset-[1.5px] rounded-[32px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-[#FFDE14] dark:via-[#FFEA5F] dark:to-[#E6C800] transition-opacity duration-300 ${
              isFocused ? 'opacity-100 animate-gradient-pulse' : 'opacity-60'
            }`}
            style={{ backgroundSize: '200% 200%' }}
          />

          {/* Container principal com glassmorphism */}
          <div className="relative flex items-center gap-3 px-6 py-4 rounded-[32px] bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border border-gray-200/50 dark:border-[#FFDE14]/10 shadow-2xl">
            {/* Linha de energia no fundo quando focado */}
            {isFocused && (
              <div className="absolute inset-0 rounded-[32px] bg-gradient-to-r from-transparent via-blue-500/5 to-transparent dark:via-[#FFDE14]/5 animate-shimmer"
                   style={{ backgroundSize: '200% 100%' }}
              />
            )}

            {/* Botão de anexo */}
            <button
              type="button"
              className="relative p-3 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-50 dark:hover:from-[#FFDE14]/20 dark:hover:to-[#FFDE14]/10 rounded-2xl transition-all duration-300 disabled:opacity-50 group/btn overflow-hidden z-10"
              disabled={isLoading}
              aria-label="Adicionar anexo"
              title="Adicionar anexo"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-[#FFDE14] dark:to-[#FFEA5F] opacity-0 group-hover/btn:opacity-10 transition-opacity" />
              <Plus className="w-5 h-5 text-gray-600 dark:text-[#FFDE14] group-hover/btn:rotate-90 group-hover/btn:scale-110 transition-all duration-300" />
            </button>

            {/* Input com efeito de typing */}
            <div className="flex-1 relative">
              {input && (
                <div className="absolute -top-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent dark:via-[#FFDE14] opacity-50 animate-pulse" />
              )}
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Pergunte algo à ASKIA..."
                disabled={isLoading}
                className="w-full px-4 py-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none text-base disabled:opacity-50 relative z-10 font-medium"
                aria-label="Digite sua mensagem"
              />
              {input && (
                <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent dark:via-[#FFDE14] opacity-50 animate-pulse" style={{ animationDelay: '0.5s' }} />
              )}
            </div>

            {/* Botão de voz */}
            <button
              type="button"
              className="relative p-3 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-50 dark:hover:from-[#FFDE14]/20 dark:hover:to-[#FFDE14]/10 rounded-2xl transition-all duration-300 disabled:opacity-50 group/btn overflow-hidden z-10"
              disabled={isLoading}
              aria-label="Mensagem de voz"
              title="Mensagem de voz"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-[#FFDE14] dark:to-[#FFEA5F] opacity-0 group-hover/btn:opacity-10 transition-opacity" />
              <Mic className="w-5 h-5 text-gray-600 dark:text-[#FFDE14] group-hover/btn:scale-110 transition-transform duration-300" />
              {isLoading && (
                <span className="absolute inset-0 rounded-2xl border-2 border-[#FFDE14] animate-ping opacity-75" />
              )}
            </button>

            {/* Botão de envio com efeito especial */}
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="relative p-3 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-[#FFDE14] dark:via-[#FFEA5F] dark:to-[#E6C800] hover:shadow-xl hover:shadow-blue-500/20 dark:hover:shadow-[#FFDE14]/40 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 shadow-lg overflow-hidden group/send z-10"
              aria-label="Enviar mensagem"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-[#FFEA5F] dark:via-[#FFD700] dark:to-[#FFDE14] opacity-0 group-hover/send:opacity-100 transition-opacity duration-300" />

              {/* Partículas ao enviar */}
              {input.trim() && !isLoading && (
                <>
                  <Sparkles className="absolute top-0 right-0 w-3 h-3 text-white dark:text-black opacity-60 animate-ping" />
                  <Zap className="absolute bottom-0 left-0 w-3 h-3 text-white dark:text-black opacity-60 animate-pulse" />
                </>
              )}

              <ArrowRight className="w-5 h-5 text-white dark:text-black relative z-10 group-hover/send:translate-x-0.5 transition-transform duration-300" />

              {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-black/30 to-transparent animate-shimmer"
                     style={{ backgroundSize: '200% 100%' }}
                />
              )}
            </button>
          </div>
        </form>

        {/* Rodapé com status */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-lg border border-gray-200/50 dark:border-[#FFDE14]/20 shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
              IA em operação
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-[#0a0a0a]/60 backdrop-blur-lg border border-gray-200/30 dark:border-[#FFDE14]/10">
            <Sparkles className="w-3 h-3 text-blue-500 dark:text-[#FFDE14] animate-pulse" />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Verifique informações importantes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
