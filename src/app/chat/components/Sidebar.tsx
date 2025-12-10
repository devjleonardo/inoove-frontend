'use client';

import { Plus, MessageSquare, Settings, LogOut, ChevronDown, User } from 'lucide-react';
import Image from 'next/image';
import { Conversation } from '@/services/v1/chatService';

interface SidebarProps {
  isDarkMode: boolean;
  conversations: Conversation[];
  selectedConversation: Conversation | null | undefined;
  isLoadingConversations: boolean;
  isLoading: boolean;
  isDropdownOpen: boolean;
  userName: string;
  userEmail: string;
  onNewChat: () => void;
  onSelectConversation: (conversation: Conversation) => void;
  onToggleDropdown: () => void;
  onSettings: () => void;
  onLogout: () => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export default function Sidebar({
  isDarkMode,
  conversations,
  selectedConversation,
  isLoadingConversations,
  isLoading,
  isDropdownOpen,
  userName,
  userEmail,
  onNewChat,
  onSelectConversation,
  onToggleDropdown,
  onSettings,
  onLogout,
  dropdownRef,
}: SidebarProps) {
  return (
    <aside className="w-full lg:w-80 h-full bg-[#E6C800] dark:bg-[#0d0d0d] border-r border-gray-900/20 dark:border-gray-800 flex flex-col transition-colors duration-300">
      <div className="p-4 lg:p-6 border-b border-gray-900/20 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
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
            <Image
              src={isDarkMode ? "/askia/ASKIA_02.png" : "/askia/Ativo 2.png"}
              alt="ASKIA"
              width={100}
              height={30}
              className="object-contain"
            />
          </div>
        </div>

        <button
          onClick={onNewChat}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gray-900 dark:bg-[#FFDE14] text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-[#E6C800] transition-all shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900 dark:disabled:hover:bg-[#FFDE14]"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Conversa</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
          Conversas Recentes
        </h3>
        <div className="space-y-2">
          {isLoadingConversations ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-gray-900 dark:border-[#FFDE14] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Nenhuma conversa ainda
              </p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`w-full text-left p-3 rounded-lg transition-all group ${
                  selectedConversation?.id === conversation.id
                    ? 'bg-white/40 dark:bg-[#FFDE14]/20'
                    : 'hover:bg-white/20 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <MessageSquare className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    selectedConversation?.id === conversation.id
                      ? 'text-gray-900 dark:text-[#FFDE14]'
                      : 'text-gray-900 dark:text-[#FFDE14] group-hover:text-gray-900 dark:group-hover:text-[#FFDE14]'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      selectedConversation?.id === conversation.id
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-900 dark:text-white group-hover:text-gray-900 dark:group-hover:text-[#FFDE14]'
                    }`}>
                      {conversation.title}
                    </p>
                    <p className={`text-xs mt-0.5 ${
                      selectedConversation?.id === conversation.id
                        ? 'text-gray-700 dark:text-gray-400'
                        : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-400'
                    }`}>
                      {conversation.updatedAt ? new Date(conversation.updatedAt).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Sem data'}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-900/20 dark:border-gray-800" ref={dropdownRef}>
        <div className="relative">
          <button
            onClick={onToggleDropdown}
            className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-900/90 dark:bg-[#FFDE14]/10 hover:bg-gray-900 dark:hover:bg-[#FFDE14]/20 transition-colors border border-white/20 dark:border-transparent"
          >
            <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center">
              <User className="w-6 h-6 text-gray-900 dark:text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-white dark:text-white truncate">
                {userName}
              </p>
              <p className="text-xs text-gray-300 dark:text-gray-400 truncate">
                {userEmail}
              </p>
            </div>
            <ChevronDown className={`w-5 h-5 text-white dark:text-white transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => {
                  onSettings();
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Configurações
                </span>
              </button>
              <button
                onClick={() => {
                  onLogout();
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left border-t border-gray-200 dark:border-gray-700"
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
