'use client';

import { Menu } from 'lucide-react';
import Image from 'next/image';

interface ChatHeaderProps {
  isDarkMode: boolean;
  onOpenSidebar: () => void;
}

export default function ChatHeader({ isDarkMode, onOpenSidebar }: ChatHeaderProps) {
  return (
    <header className="lg:hidden flex items-center gap-3 p-4 border-b border-[#E6C800]/30 dark:border-gray-800 bg-[#FFDE14]/50 dark:bg-black/50 backdrop-blur-sm">
      <button
        onClick={onOpenSidebar}
        className="p-2 hover:bg-[#E6C800]/20 dark:hover:bg-gray-700 rounded-lg transition-colors"
        aria-label="Abrir menu"
      >
        <Menu className="w-6 h-6 text-gray-900 dark:text-gray-200" />
      </button>
      <div className="flex items-center gap-2">
        <Image
          src={isDarkMode ? "/askia/ASKIA_03.png" : "/askia/ASKIA_04.png"}
          alt="ASKIA Logo"
          width={32}
          height={32}
          className="object-contain"
        />
        <Image
          src="/askia/ASKIA_02.png"
          alt="ASKIA"
          width={80}
          height={24}
          className="object-contain"
        />
      </div>
    </header>
  );
}
