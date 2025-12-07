'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import AdminSidebar from './components/AdminSidebar';
import OverviewSection from './sections/OverviewSection';
import AnalyticsSection from './sections/AnalyticsSection';
import CostsSection from './sections/CostsSection';

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

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

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'overview':
        return 'Visão Geral';
      case 'analytics':
        return 'Analytics Detalhado';
      case 'costs':
        return 'Custos & Tokens';
      case 'training':
        return 'Treinamento & Gaps';
      case 'performance':
        return 'Performance';
      case 'users':
        return 'Usuários';
      default:
        return 'Dashboard';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FFDE14] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black overflow-hidden">
      <AdminSidebar
        isDarkMode={isDarkMode}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/chat')}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Voltar para o chat"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {getSectionTitle()}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Inteligência Organizacional • Askia
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Alternar tema"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-900" />
                  )}
                </button>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
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
            {activeSection === 'analytics' && <AnalyticsSection isDarkMode={isDarkMode} />}
            {activeSection === 'costs' && <CostsSection isDarkMode={isDarkMode} />}
            {activeSection === 'training' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Treinamento & Gaps
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Em desenvolvimento...
                </p>
              </div>
            )}
            {activeSection === 'performance' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Performance
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Em desenvolvimento...
                </p>
              </div>
            )}
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
