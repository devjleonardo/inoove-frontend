'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Mic, MoreHorizontal, MessageSquare, Menu, X, Sparkles, Clock, Sun, Moon } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chatHistory] = useState<ChatHistory[]>([
    { id: '1', title: 'Conversa anterior 1', timestamp: new Date(Date.now() - 86400000) },
    { id: '2', title: 'Conversa anterior 2', timestamp: new Date(Date.now() - 172800000) },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Esta é uma resposta simulada da IA. Você pode integrar aqui sua API de IA preferida (OpenAI, Anthropic, Google, etc).',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleNewChat = () => {
    setMessages([]);
    setIsSidebarOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#FFDE14] via-[#FFEA5F] to-[#E6C800] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden transition-colors duration-300">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 lg:w-80
          bg-gradient-to-b from-[#FFDE14] to-[#E6C800] dark:from-gray-800 dark:to-gray-900
          border-r border-[#E6C800]/30 dark:border-gray-700
          flex flex-col
          transform transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-4 lg:p-6 border-b border-[#E6C800]/20 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-900 to-gray-800 dark:from-[#FFDE14] dark:to-[#E6C800] flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-[#FFDE14] dark:text-gray-900" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">ASKIA</h1>
                <p className="text-xs text-gray-700 dark:text-gray-300">Sua assistente inteligente</p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-yellow-600/20 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5 text-gray-800 dark:text-gray-200" />
            </button>
          </div>

          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-[#FFDE14] dark:hover:bg-[#FFEA5F] text-white dark:text-gray-900 rounded-xl px-4 py-3 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Nova Conversa</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <h2 className="text-xs font-semibold text-gray-700 dark:text-gray-400 uppercase tracking-wide mb-3 px-2">
            Histórico
          </h2>
          <div className="space-y-2">
            {chatHistory.map((chat) => (
              <button
                key={chat.id}
                className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-yellow-600/20 dark:hover:bg-gray-700/50 transition-colors text-left group"
              >
                <MessageSquare className="w-4 h-4 text-gray-700 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate group-hover:text-gray-800 dark:group-hover:text-white">
                    {chat.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {chat.timestamp.toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-[#E6C800]/20 dark:border-gray-700 space-y-3">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-[#E6C800]/20 dark:bg-gray-700/50 hover:bg-[#E6C800]/30 dark:hover:bg-gray-700 transition-colors"
            aria-label="Alternar tema"
          >
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {isDarkMode ? 'Tema Escuro' : 'Tema Claro'}
            </span>
            <div className="relative w-12 h-6 bg-gray-900 dark:bg-[#FFDE14] rounded-full transition-colors">
              <div className={`absolute top-1 ${isDarkMode ? 'right-1' : 'left-1'} w-4 h-4 bg-white rounded-full transition-all duration-300 flex items-center justify-center`}>
                {isDarkMode ? (
                  <Moon className="w-3 h-3 text-gray-900" />
                ) : (
                  <Sun className="w-3 h-3 text-[#FFDE14]" />
                )}
              </div>
            </div>
          </button>

          <div className="bg-[#E6C800]/20 dark:bg-gray-700/50 rounded-lg p-3">
            <p className="text-xs font-medium text-gray-800 dark:text-gray-200 mb-1">💡 Dica do dia</p>
            <p className="text-xs text-gray-700 dark:text-gray-400">
              Use comandos específicos para obter respostas mais precisas!
            </p>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center gap-3 p-4 border-b border-[#E6C800]/30 dark:border-gray-700 bg-[#FFDE14]/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-[#E6C800]/20 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Abrir menu"
          >
            <Menu className="w-6 h-6 text-gray-900 dark:text-gray-200" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-900 to-gray-800 dark:from-[#FFDE14] dark:to-[#E6C800] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#FFDE14] dark:text-gray-900" />
            </div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">ASKIA</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center p-4">
              <div className="text-center max-w-2xl mx-auto space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gray-900 to-gray-800 dark:from-[#FFDE14] dark:to-[#E6C800] flex items-center justify-center shadow-2xl">
                  <Sparkles className="w-10 h-10 text-[#FFDE14] dark:text-gray-900" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    Olá! Sou a ASKIA
                  </h2>
                  <p className="text-lg md:text-xl text-gray-800 dark:text-gray-300">
                    O que podemos fazer hoje?
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
                  {[
                    { icon: '✍️', text: 'Escrever um texto' },
                    { icon: '💡', text: 'Gerar ideias criativas' },
                    { icon: '🔍', text: 'Pesquisar informações' },
                    { icon: '📊', text: 'Analisar dados' },
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInput(suggestion.text);
                        inputRef.current?.focus();
                      }}
                      className="p-4 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-xl text-left transition-all hover:shadow-lg active:scale-95 border border-transparent dark:border-gray-700"
                    >
                      <span className="text-2xl mb-2 block">{suggestion.icon}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{suggestion.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl w-full mx-auto px-4 py-6 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  } animate-in fade-in slide-in-from-bottom-4 duration-300`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-900 to-gray-800 dark:from-[#FFDE14] dark:to-[#E6C800] flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Sparkles className="w-4 h-4 text-[#FFDE14] dark:text-gray-900" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-lg ${
                      message.role === 'user'
                        ? 'bg-gray-900 dark:bg-[#FFDE14] text-white dark:text-gray-900'
                        : 'bg-white/95 dark:bg-gray-800/95 text-gray-900 dark:text-gray-100 backdrop-blur-sm border border-transparent dark:border-gray-700'
                    }`}
                  >
                    <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <time className="text-xs opacity-60 mt-2 block">
                      {message.timestamp.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-[#FFDE14] flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-white dark:text-gray-900 text-sm font-bold">U</span>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-900 to-gray-800 dark:from-[#FFDE14] dark:to-[#E6C800] flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Sparkles className="w-4 h-4 text-[#FFDE14] dark:text-gray-900" />
                  </div>
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-transparent dark:border-gray-700">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-600 dark:bg-[#FFDE14] rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-600 dark:bg-[#FFDE14] rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-gray-600 dark:bg-[#FFDE14] rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="p-4 md:p-6 border-t border-[#E6C800]/30 dark:border-gray-700 bg-[#FFDE14]/30 dark:bg-gray-800/30 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Diga algo..."
                disabled={isLoading}
                className="w-full pl-6 pr-32 py-4 rounded-3xl bg-white/95 dark:bg-gray-800 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-[#FFDE14]/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl transition-all border border-transparent dark:border-gray-700"
                aria-label="Digite sua mensagem"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50"
                  disabled={isLoading}
                  aria-label="Adicionar anexo"
                  title="Adicionar anexo"
                >
                  <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50"
                  disabled={isLoading}
                  aria-label="Mais opções"
                  title="Mais opções"
                >
                  <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50"
                  disabled={isLoading}
                  aria-label="Mensagem de voz"
                  title="Mensagem de voz"
                >
                  <Mic className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </form>
            <p className="text-xs text-gray-800/70 dark:text-gray-400/70 text-center mt-3">
              A ASKIA pode cometer erros. Considere verificar informações importantes.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
