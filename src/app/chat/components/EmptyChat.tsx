'use client';

import Image from 'next/image';
import { Sparkles, Zap, Search, Lightbulb, FileText, Code, Cpu, CircuitBoard, Binary, Braces, Database, Network, Terminal, Workflow } from 'lucide-react';
import { useState } from 'react';

interface EmptyChatProps {
  isDarkMode: boolean;
}

export default function EmptyChat({ isDarkMode }: EmptyChatProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const suggestions = [
    {
      icon: FileText,
      text: 'Escrever um texto criativo',
      gradient: 'from-blue-500 to-cyan-500',
      darkGradient: 'dark:from-[#FFDE14] dark:to-[#FFEA5F]'
    },
    {
      icon: Lightbulb,
      text: 'Gerar ideias inovadoras',
      gradient: 'from-purple-500 to-pink-500',
      darkGradient: 'dark:from-[#FFEA5F] dark:to-[#FFD700]'
    },
    {
      icon: Search,
      text: 'Pesquisar informações',
      gradient: 'from-green-500 to-emerald-500',
      darkGradient: 'dark:from-[#FFD700] dark:to-[#E6C800]'
    },
    {
      icon: Code,
      text: 'Ajudar com programação',
      gradient: 'from-orange-500 to-red-500',
      darkGradient: 'dark:from-[#FFDE14] dark:to-[#FFEA5F]'
    },
  ];

  return (
    <div className="h-full flex items-center justify-center p-4 relative overflow-hidden">
      <div className="text-center max-w-4xl mx-auto space-y-10 animate-in fade-in duration-1000 relative z-10">
        {/* Logo completo */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <Image
              src={isDarkMode ? "/askia/ASKIA_03.png" : "/askia/ASKIA_04.png"}
              alt="ASKIA Logo"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
          <div className="relative">
            <Image
              src="/askia/ASKIA_02.png"
              alt="ASKIA"
              width={240}
              height={72}
              className="object-contain"
            />
          </div>
        </div>

        {/* Texto de boas-vindas */}
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: '200ms' }}>
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-[#FFDE14] dark:via-[#FFEA5F] dark:to-[#FFDE14] bg-clip-text text-transparent animate-gradient-x" style={{ backgroundSize: '200% 200%' }}>
              Como posso ajudar você hoje?
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mt-2 font-medium">
              Explore as possibilidades infinitas da Aksia Irrah
            </p>
          </div>
        </div>

        {/* Cards de sugestões com efeitos futuristas */}

        {/* Texto de incentivo */}
        <div className="animate-in fade-in duration-1000" style={{ animationDelay: '600ms' }}>
          <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center justify-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 animate-pulse" />
            Digite sua pergunta no campo abaixo para começar
            <Zap className="w-4 h-4 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </p>
        </div>
      </div>
    </div>
  );
}
