'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Mic, MoreHorizontal, MessageSquare, Menu, X, Sparkles, Clock, Sun, Moon, ArrowRight, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { chatService, Conversation, MessageDTO } from '@/services/chatService';
import Image from 'next/image';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>();
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
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

  useEffect(() => {
    if (user?.chatId) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    if (!user?.chatId) return;

    setIsLoadingConversations(true);
    try {
      const data = await chatService.listConversations(user.chatId);
      setConversations(data);
    } catch (error: any) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    setIsLoading(true);
    try {
      const data = await chatService.getMessages(user!.chatId, conversationId);
      const formattedMessages: Message[] = data.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.createdAt),
      }));
      setMessages(formattedMessages);
    } catch (error: any) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !user?.chatId) return;

    let conversationToUse = selectedConversation || null;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    const userInput = input;
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatService.ask(user.chatId, conversationToUse?.id, {
        text: userInput,
        userId: user.id,
      });

      if (!conversationToUse && response.conversationId) {
        const updatedConversations = await chatService.listConversations(user.chatId);
        setConversations(updatedConversations);

        const newConversation = updatedConversations.find(c => c.id === response.conversationId);
        if (newConversation) {
          setSelectedConversation(newConversation);
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Desculpe, ocorreu um erro ao processar sua mensagem: ${error.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setSelectedConversation(null);
    setMessages([]);
    setIsSidebarOpen(false);
    inputRef.current?.focus();
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSettings = () => {
    console.log('Abrir configurações');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#FFDE14] via-[#FFEA5F] to-[#E6C800] dark:from-black dark:via-black dark:to-black overflow-hidden transition-colors duration-300">
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
          bg-gradient-to-b from-[#FFDE14] to-[#E6C800] dark:from-black dark:to-black
          border-r border-[#E6C800]/30 dark:border-gray-800
          flex flex-col
          transform transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-4 lg:p-6 border-b border-[#E6C800]/20 dark:border-gray-800">
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
                src="/askia/ASKIA_02.png"
                alt="ASKIA"
                width={100}
                height={30}
                className="object-contain"
              />
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-yellow-600/20 dark:hover:bg-[#FFDE14]/20 rounded-lg transition-colors"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5 text-gray-800 dark:text-white" />
            </button>
          </div>

          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-[#FFDE14] dark:hover:bg-[#FFEA5F] text-white dark:text-black rounded-xl px-4 py-3 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Nova Conversa</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <h2 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3 px-2">
            Histórico
          </h2>
          {isLoadingConversations ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-gray-700 dark:border-[#FFDE14] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.length === 0 ? (
                <p className="text-xs text-gray-600 dark:text-gray-400 text-center py-4">
                  Nenhuma conversa ainda
                </p>
              ) : (
                conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg hover:bg-yellow-600/20 dark:hover:bg-[#FFDE14]/10 transition-colors text-left group border ${
                      selectedConversation?.id === conversation.id
                        ? 'bg-yellow-600/20 dark:bg-[#FFDE14]/10 border-white/30 dark:border-[#FFDE14]/20'
                        : 'border-white/0 dark:border-[#FFDE14]/0 hover:border-white/30 dark:hover:border-[#FFDE14]/20'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 text-gray-700 dark:text-[#FFDE14] mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-gray-800 dark:group-hover:text-[#FFDE14]">
                        {conversation.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        {conversation.updatedAt ? new Date(conversation.updatedAt).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Sem data'}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#E6C800]/20 dark:border-gray-800 space-y-3">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-900/90 dark:bg-[#FFDE14]/10 hover:bg-gray-900 dark:hover:bg-[#FFDE14]/20 transition-colors border border-white/20 dark:border-transparent"
            aria-label="Alternar tema"
          >
            <span className="text-sm font-medium text-white dark:text-white">
              {isDarkMode ? 'Tema Escuro' : 'Tema Claro'}
            </span>
            <div className="relative w-12 h-6 bg-white dark:bg-[#FFDE14] rounded-full transition-colors">
              <div className={`absolute top-1 ${isDarkMode ? 'right-1' : 'left-1'} w-4 h-4 bg-gray-900 dark:bg-white rounded-full transition-all duration-300 flex items-center justify-center`}>
                {isDarkMode ? (
                  <Moon className="w-3 h-3 text-white dark:text-gray-900" />
                ) : (
                  <Sun className="w-3 h-3 text-white" />
                )}
              </div>
            </div>
          </button>

          <button
            onClick={handleSettings}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-900/90 dark:bg-[#FFDE14]/10 hover:bg-gray-900 dark:hover:bg-[#FFDE14]/20 transition-colors border border-white/20 dark:border-transparent"
            aria-label="Configurações"
          >
            <span className="text-sm font-medium text-white dark:text-white">
              Configurações
            </span>
            <Settings className="w-5 h-5 text-white dark:text-white" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-red-600/90 dark:bg-red-600/90 hover:bg-red-700 dark:hover:bg-red-700 transition-colors border border-red-500/50 dark:border-red-500/50"
            aria-label="Sair"
          >
            <span className="text-sm font-medium text-white">
              Sair
            </span>
            <LogOut className="w-5 h-5 text-white" />
          </button>

          <div className="bg-gray-900/90 dark:bg-[#FFDE14]/10 rounded-lg p-3 border border-white/20 dark:border-[#FFDE14]/20">
            <p className="text-xs font-medium text-white dark:text-white mb-1">💡 Dica do dia</p>
            <p className="text-xs text-gray-300 dark:text-gray-300">
              Use comandos específicos para obter respostas mais precisas!
            </p>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center gap-3 p-4 border-b border-[#E6C800]/30 dark:border-gray-800 bg-[#FFDE14]/50 dark:bg-black/50 backdrop-blur-sm">
          <button
            onClick={() => setIsSidebarOpen(true)}
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

        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center p-4">
              <div className="text-center max-w-2xl mx-auto space-y-6">
                <div className="w-32 h-32 mx-auto flex items-center justify-center">
                  <Image
                    src={isDarkMode ? "/askia/ASKIA_03.png" : "/askia/ASKIA_04.png"}
                    alt="ASKIA Logo"
                    width={128}
                    height={128}
                    className="object-contain"
                  />
                </div>
                <div>
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
                    { icon: '🔍', text: 'Pesquisar informações' },
                    { icon: '📊', text: 'Analisar dados' },
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInput(suggestion.text);
                        inputRef.current?.focus();
                      }}
                      className="p-4 bg-white/80 dark:bg-[#FFDE14]/10 hover:bg-white dark:hover:bg-[#FFDE14]/20 rounded-xl text-left transition-all hover:shadow-lg active:scale-95 border border-transparent dark:border-[#FFDE14]/20"
                    >
                      <span className="text-2xl mb-2 block">{suggestion.icon}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{suggestion.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  } animate-in fade-in slide-in-from-bottom-4 duration-500`}
                >
                  <div className={`flex gap-4 max-w-[90%] md:max-w-[48%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                          message.role === 'user'
                            ? 'bg-white dark:bg-gray-800'
                            : 'bg-white dark:bg-gray-800'
                        }`}
                      >
                        {message.role === 'assistant' ? (
                          <Image
                            src={isDarkMode ? "/askia/ASKIA_03.png" : "/askia/ASKIA_04.png"}
                            alt="ASKIA"
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        ) : (
                          <Image
                            src={isDarkMode ? "/askia/ASKIA_04.png" : "/askia/ASKIA_03.png"}
                            alt="User"
                            width={24}
                            height={24}
                            className="object-contain"
                          />
                        )}
                      </div>
                      {message.role === 'assistant' && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-black" />
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className={`flex items-center gap-2 mb-2 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="font-bold text-sm text-gray-900 dark:text-white">
                          {message.role === 'assistant' ? 'ASKIA' : 'Você'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {message.timestamp instanceof Date
                            ? message.timestamp.toLocaleString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : new Date(message.timestamp).toLocaleString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                          }
                        </span>
                      </div>

                      <div
                        className={`p-4 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-gray-900 dark:bg-[#FFDE14] text-white dark:text-black'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                        } shadow-lg inline-block`}
                      >
                        <p className="text-base leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex gap-4 max-w-[90%] md:max-w-[48%]">
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-white dark:bg-gray-800 animate-pulse">
                        <Image
                          src={isDarkMode ? "/askia/ASKIA_03.png" : "/askia/ASKIA_04.png"}
                          alt="ASKIA"
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-sm text-gray-900 dark:text-white">ASKIA</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">digitando...</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg inline-block">
                        <div className="flex gap-2">
                          <div className="w-2.5 h-2.5 bg-gray-400 dark:bg-[#FFDE14] rounded-full animate-bounce" />
                          <div className="w-2.5 h-2.5 bg-gray-400 dark:bg-[#FFDE14] rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-2.5 h-2.5 bg-gray-400 dark:bg-[#FFDE14] rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[#E6C800]/30 dark:border-gray-800 bg-gradient-to-t from-white to-transparent dark:from-black dark:to-transparent">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFDE14] to-[#E6C800] dark:from-[#FFDE14] dark:to-[#E6C800] rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />

              <div className="relative flex items-center gap-3 p-2 rounded-3xl bg-white dark:bg-[#1a1a1a] border-2 border-gray-200 dark:border-[#FFDE14]/30 shadow-2xl">
                <button
                  type="button"
                  className="p-3 hover:bg-gray-100 dark:hover:bg-[#FFDE14]/20 rounded-2xl transition-all disabled:opacity-50 group/btn"
                  disabled={isLoading}
                  aria-label="Adicionar anexo"
                  title="Adicionar anexo"
                >
                  <Plus className="w-5 h-5 text-gray-600 dark:text-[#FFDE14] group-hover/btn:scale-110 transition-transform" />
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pergunte algo à ASKIA..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none text-base disabled:opacity-50"
                  aria-label="Digite sua mensagem"
                />

                <button
                  type="button"
                  className="p-3 hover:bg-gray-100 dark:hover:bg-[#FFDE14]/20 rounded-2xl transition-all disabled:opacity-50 group/btn"
                  disabled={isLoading}
                  aria-label="Mensagem de voz"
                  title="Mensagem de voz"
                >
                  <Mic className="w-5 h-5 text-gray-600 dark:text-[#FFDE14] group-hover/btn:scale-110 transition-transform" />
                </button>

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-3 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 dark:from-[#FFDE14] dark:to-[#E6C800] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all shadow-lg"
                  aria-label="Enviar mensagem"
                >
                  <ArrowRight className="w-5 h-5 text-white dark:text-black" />
                </button>
              </div>
            </form>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              A ASKIA pode cometer erros. Verifique informações importantes.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
