'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Zap, Brain, MessageCircle, Sun, Moon } from 'lucide-react';
import { authService } from '@/services/authService';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export default function LoginPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUser } = useAuth();

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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      router.push('/chat');
    } catch (error: any) {
      setError(error.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFDE14] via-[#FFEA5F] to-[#E6C800] dark:from-black dark:via-black dark:to-black transition-colors duration-300 flex items-center justify-center p-4 relative">
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95"
        aria-label="Alternar tema"
      >
        {isDarkMode ? (
          <Sun className="w-6 h-6 text-yellow-500" />
        ) : (
          <Moon className="w-6 h-6 text-gray-900" />
        )}
      </button>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFDE14]/20 dark:bg-[#FFDE14]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E6C800]/20 dark:bg-[#E6C800]/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
      </div>

      <div className="relative w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="text-center lg:text-left space-y-8 order-2 lg:order-1">
          <div className="flex flex-col items-center lg:items-start gap-3">
            <div className="flex items-center gap-3">
              <Image
                src={isDarkMode ? "/askia/ASKIA_03.png" : "/askia/ASKIA_04.png"}
                alt="ASKIA Logo"
                width={60}
                height={60}
                className="object-contain"
              />
              <Image
                src="/askia/ASKIA_02.png"
                alt="ASKIA"
                width={150}
                height={45}
                className="object-contain"
              />
            </div>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
              Inteligência Ativa
            </p>
          </div>

          <div className="space-y-4 max-w-xl">
            <p className="text-base md:text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
              É o nome que traduz a essência da inteligência ativa.
            </p>
            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              É o agente que responde, orienta e esclarece, sempre pronto, sempre acessível.
            </p>
            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Simples, direto e moderno, reforça o ato de perguntar como ponto de partida para mais autonomia, clareza e agilidade dentro do Irrah Tech.
            </p>
          </div>

          <div className="relative max-w-md">
            <div className="space-y-0">
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Pergunte.
              </h3>
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Descubra.
              </h3>
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-blue-600 dark:text-white leading-tight">
                Resolva.
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="flex items-center gap-3 text-gray-800 dark:text-gray-200">
              <div className="w-10 h-10 rounded-lg bg-gray-900/10 dark:bg-white/10 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Rápido</span>
            </div>
            <div className="flex items-center gap-3 text-gray-800 dark:text-gray-200">
              <div className="w-10 h-10 rounded-lg bg-gray-900/10 dark:bg-white/10 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Inteligente</span>
            </div>
            <div className="flex items-center gap-3 text-gray-800 dark:text-gray-200">
              <div className="w-10 h-10 rounded-lg bg-gray-900/10 dark:bg-white/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Acessível</span>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 mx-auto flex items-center justify-center">
                  <Image
                    src={isDarkMode ? "/askia/ASKIA_03.png" : "/askia/ASKIA_04.png"}
                    alt="ASKIA Logo"
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Bem-vindo de volta!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Entre para continuar sua jornada com a ASKIA
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="seu@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFDE14] dark:focus:ring-[#FFDE14] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Senha
                    </label>
                    <input
                      type="password"
                      id="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFDE14] dark:focus:ring-[#FFDE14] focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700">
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-[#FFDE14] focus:ring-[#FFDE14]"
                    />
                    <span className="text-gray-600 dark:text-gray-400">Lembrar de mim</span>
                  </label>
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
                    Esqueceu a senha?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#FFDE14] to-[#E6C800] hover:from-[#FFEA5F] hover:to-[#FFDE14] text-gray-900 font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{isLoading ? 'Entrando...' : 'Entrar'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Não tem uma conta?{' '}
                <a href="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
                  Criar conta
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
