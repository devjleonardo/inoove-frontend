'use client';

import {
  LayoutDashboard,
  Users,
  ChevronDown,
  User,
  LogOut,
  BookOpen,
  Bot,
  Brain
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface AdminSidebarProps {
  isDarkMode: boolean;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function AdminSidebar({ isDarkMode, activeSection, onSectionChange }: AdminSidebarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const menuItems = [
    {
      id: 'overview',
      label: 'Visão Geral',
      icon: LayoutDashboard,
      description: 'Dashboard principal'
    },
    {
      id: 'intelligence',
      label: 'Inteligência',
      icon: Brain,
      description: 'Inteligência organizacional'
    },
    {
      id: 'agents',
      label: 'Agentes',
      icon: Bot,
      description: 'Sincronizar agentes'
    },
    {
      id: 'training',
      label: 'Treinamento',
      icon: BookOpen,
      description: 'Candidatos pendentes'
    },
    {
      id: 'users',
      label: 'Usuários',
      icon: Users,
      description: 'Gestão de usuários'
    },
  ];

  return (
    <aside className="w-72 h-full bg-[#FFDE14] dark:bg-[#121212] border-r border-gray-400 dark:border-gray-800 transition-all duration-700 flex flex-col">
      
      <div className="p-6 border-b border-gray-400 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <Image
              src={isDarkMode ? "/askia/ASKIA_03.png" : "/askia/ASKIA_04.png"}
              alt="ASKIA Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-950 dark:text-white">
              Askia Admin
            </h2>
            <p className="text-xs text-gray-700 dark:text-gray-400">
              Inteligência Organizacional
            </p>
          </div>
        </div>
      </div>

      
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg transition-all group
                  ${isActive
                    ? 'bg-white/40 dark:bg-[#FFDE14]/20'
                    : 'hover:bg-white/20 dark:hover:bg-white/5'
                  }
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-gray-950 dark:text-[#FFDE14]' : 'text-gray-700 dark:text-gray-400'}`} />
                <div className="flex-1 text-left">
                  <p className={`text-sm font-semibold ${isActive ? 'text-gray-950 dark:text-[#FFDE14]' : 'text-gray-700 dark:text-gray-400'}`}>
                    {item.label}
                  </p>
                  <p className={`text-xs ${isActive ? 'text-gray-700 dark:text-[#FFDE14]/80' : 'text-gray-600 dark:text-gray-500'}`}>
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      
      <div className="p-4 border-t border-gray-400 dark:border-gray-800" ref={dropdownRef}>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-900/90 dark:bg-[#FFDE14]/10 hover:bg-gray-900 dark:hover:bg-[#FFDE14]/20 transition-colors border border-white/20 dark:border-transparent"
          >
            <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center">
              <User className="w-6 h-6 text-gray-900 dark:text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-white dark:text-white truncate">
                {user?.name || 'Usuário'}
              </p>
              <p className="text-xs text-gray-300 dark:text-gray-400 truncate">
                {user?.email || ''}
              </p>
            </div>
            <ChevronDown className={`w-5 h-5 text-white dark:text-white transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
              >
                <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  Sair
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
