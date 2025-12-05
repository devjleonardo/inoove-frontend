'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { chatService, Conversation, MessageDTO } from '@/services/chatService';
import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import EmptyChat from './components/EmptyChat';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import SettingsModal from './components/SettingsModal';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    }
  }, [isAuthenticated, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
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
    setIsSettingsOpen(true);
    setIsDropdownOpen(false);
  };

  const handleSaveSettings = () => {
    setIsSettingsOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#FFDE14] dark:bg-black overflow-hidden transition-colors duration-300 relative">
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

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <Sidebar
          isDarkMode={isDarkMode}
          conversations={conversations}
          selectedConversation={selectedConversation}
          isLoadingConversations={isLoadingConversations}
          isDropdownOpen={isDropdownOpen}
          userName={user?.name || 'Usuário'}
          userEmail={user?.email || ''}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onToggleDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
          onSettings={handleSettings}
          onLogout={handleLogout}
          dropdownRef={dropdownRef}
        />
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <ChatHeader isDarkMode={isDarkMode} onOpenSidebar={() => setIsSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <EmptyChat isDarkMode={isDarkMode} />
          ) : (
            <MessageList
              messages={messages}
              isLoading={isLoading}
              isDarkMode={isDarkMode}
              messagesEndRef={messagesEndRef}
            />
          )}
        </div>

        <ChatInput
          input={input}
          isLoading={isLoading}
          onInputChange={setInput}
          onSubmit={handleSubmit}
          inputRef={inputRef}
        />
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        userName={user?.name || 'Usuário'}
        userEmail={user?.email || ''}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
