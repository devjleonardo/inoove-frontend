'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sun, Moon, MessageSquare } from 'lucide-react';
import AdminSidebar from './components/AdminSidebar';
import OverviewSection from './sections/OverviewSection';
import AgentsSyncSection from './sections/AgentsSyncSection';
import TrainingCandidatesSection from './sections/TrainingCandidatesSection';

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['overview']);

  useEffect(() => {
    const savedTheme = localStorage.getItem('askia-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    } else if (savedTheme === null) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('askia-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    if (user?.role !== 'admin') {
      router.push('/chat');
      return;
    }

    setIsLoading(false);
  }, [isAuthenticated, user, router]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSectionChange = (section: string) => {
    setNavigationHistory(prev => [...prev, section]);
    setActiveSection(section);
  };

  const handleGoBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remove current
      const previousSection = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setActiveSection(previousSection);
    }
  };

  const canGoBack = navigationHistory.length > 1;

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'overview':
        return 'Visão Geral';
      case 'agents':
        return 'Sincronização de Agentes';
      case 'training':
        return 'Candidatos de Treinamento';
      case 'users':
        return 'Usuários';
      default:
        return 'Dashboard';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFDE14] dark:bg-[#121212] flex items-center justify-center transition-colors duration-700">
        <div className="w-12 h-12 border-4 border-gray-900 dark:border-[#FFDE14] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FFDE14] dark:bg-[#121212] overflow-hidden transition-colors duration-700">
      <AdminSidebar
        isDarkMode={isDarkMode}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-[#FFDE14] dark:bg-[#121212] border-b border-gray-400 dark:border-gray-800 z-10 transition-colors duration-700">
          <div className="px-6 h-[118px] flex items-center">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                {canGoBack && (
                  <button
                    onClick={handleGoBack}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                    title="Voltar"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-400" />
                  </button>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-950 dark:text-white">
                    {getSectionTitle()}
                  </h1>
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    Inteligência Organizacional • Askia
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push('/chat')}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                  title="Ir para o chat"
                >
                  <MessageSquare className="w-5 h-5 text-gray-700 dark:text-gray-400" />
                </button>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Alternar tema"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-900" />
                  )}
                </button>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-950 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-400">
                    Administrador
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {activeSection === 'overview' && <OverviewSection isDarkMode={isDarkMode} />}
            {activeSection === 'agents' && <AgentsSyncSection isDarkMode={isDarkMode} />}
            {activeSection === 'training' && <TrainingCandidatesSection isDarkMode={isDarkMode} />}
            {activeSection === 'users' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Gestão de Usuários
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Em desenvolvimento...
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
