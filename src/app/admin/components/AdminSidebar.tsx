'use client';

import {
  LayoutDashboard,
  BarChart3,
  DollarSign,
  GraduationCap,
  TrendingUp,
  Users,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface AdminSidebarProps {
  isDarkMode: boolean;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function AdminSidebar({ isDarkMode, activeSection, onSectionChange }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      id: 'overview',
      label: 'Visão Geral',
      icon: LayoutDashboard,
      description: 'Dashboard principal'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Análises detalhadas'
    },
    {
      id: 'costs',
      label: 'Custos & Tokens',
      icon: DollarSign,
      description: 'Controle financeiro'
    },
    {
      id: 'training',
      label: 'Treinamento',
      icon: GraduationCap,
      description: 'Gaps e sugestões'
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: TrendingUp,
      description: 'Métricas de eficiência'
    },
    {
      id: 'users',
      label: 'Usuários',
      icon: Users,
      description: 'Gestão de usuários'
    },
  ];

  return (
    <aside
      className={`
        relative h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transition-all duration-300 flex flex-col
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
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
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Askia Admin
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Inteligência Organizacional
                </p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 flex items-center justify-center mx-auto">
              <Image
                src={isDarkMode ? "/askia/ASKIA_03.png" : "/askia/ASKIA_04.png"}
                alt="ASKIA Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
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
                  w-full flex items-center gap-3 p-3 rounded-xl transition-all group
                  ${isActive
                    ? 'bg-gradient-to-r from-[#FFDE14] to-[#FFEA5F] dark:from-[#FFDE14] dark:to-[#FFEA5F] text-gray-900 shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-gray-900' : ''}`} />
                {!isCollapsed && (
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-semibold ${isActive ? 'text-gray-900' : ''}`}>
                      {item.label}
                    </p>
                    <p className={`text-xs ${isActive ? 'text-gray-700' : 'text-gray-500 dark:text-gray-500'}`}>
                      {item.description}
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer - Collapse Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-400"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Recolher</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
