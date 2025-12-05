'use client';

import Image from 'next/image';

interface EmptyChatProps {
  isDarkMode: boolean;
}

export default function EmptyChat({ isDarkMode }: EmptyChatProps) {
  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto space-y-6 animate-in fade-in duration-700">
        <div className="w-32 h-32 mx-auto flex items-center justify-center">
          <div className="animate-float">
            <Image
              src={isDarkMode ? "/askia/ASKIA_03.png" : "/askia/ASKIA_04.png"}
              alt="ASKIA Logo"
              width={128}
              height={128}
              className="object-contain"
            />
          </div>
        </div>
        <div className="animate-in slide-in-from-bottom-4 duration-1000">
          <Image
            src="/askia/ASKIA_02.png"
            alt="ASKIA"
            width={200}
            height={60}
            className="object-contain mx-auto mb-4"
          />
          <p className="text-lg md:text-xl text-gray-800 dark:text-gray-300">
            O que podemos fazer hoje?
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
          {[
            { icon: '✍️', text: 'Escrever um texto' },
            { icon: '💡', text: 'Gerar ideias criativas' },
            { icon: '📊', text: 'Analisar dados' },
            { icon: '🔍', text: 'Pesquisar informações' },
          ].map((item, index) => (
            <button
              key={index}
              className="p-4 rounded-xl bg-gray-900/90 dark:bg-[#FFDE14]/10 border-2 border-gray-900 dark:border-[#FFDE14]/20 hover:bg-gray-900 dark:hover:bg-[#FFDE14]/20 hover:border-gray-700 dark:hover:border-[#FFDE14] hover:shadow-lg transition-all group"
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-sm font-medium text-white dark:text-gray-200 group-hover:text-gray-200 dark:group-hover:text-white">
                {item.text}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
