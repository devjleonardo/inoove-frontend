'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Sun, Moon, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { chatService, Conversation, MessageDTO } from '@/services/v1/chatService';
import { feedbackService } from '@/services/v1/feedbackService';
import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import EmptyChat from './components/EmptyChat';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import SettingsModal from './components/SettingsModal';
import { conversationServiceV2 } from '@/services/v2/conversationServiceV2';

const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
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
      if (API_VERSION === 'v2') {
        const data = await conversationServiceV2.listConversations(user.chatId);
        setConversations(data.map((conv : any) => ({
          ...conv,
          createdAt: conv.updatedAt
        })));
      } else {
        const data = await chatService.listConversations(user.chatId);
        setConversations(data);
      }
    } catch (error: any) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      if (API_VERSION === 'v2') {
        const data = await conversationServiceV2.listMessages(user!.chatId, conversationId);
        const formattedMessages: Message[] = data.map((msg : any) => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(formattedMessages);
      } else {
        const data = await chatService.getMessages(user!.chatId, conversationId);
        const formattedMessages: Message[] = data.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.createdAt),
        }));
        setMessages(formattedMessages);
      }
    } catch (error: any) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !user?.chatId) return;

    let conversationToUse = selectedConversation || null;

    const messageId = Date.now().toString();
    const userMessage: Message = {
      id: messageId,
      role: 'user',
      content: input,
      timestamp: new Date(),
      status: 'sending',
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsLoading(true);

    try {
      setMessages((prev) => prev.map(msg =>
        msg.id === messageId ? { ...msg, status: 'sent' as const } : msg
      ));

      let response;
      if (API_VERSION === 'v2') {
        response = await conversationServiceV2.sendMessage({
          conversationId: conversationToUse?.id,
          userId: user.id,
          content: userInput,
        });
      } else {
        response = await chatService.ask(user.chatId, conversationToUse?.id, {
          text: userInput,
          userId: user.id,
        });
      }

      if (!conversationToUse && response.conversationId) {
        if (API_VERSION === 'v2') {
          const data = await conversationServiceV2.listConversations(user.chatId);
          const updatedConversations = data.map((conv : any) => ({
            ...conv,
            createdAt: conv.updatedAt
          }));
          setConversations(updatedConversations);
          const newConversation = updatedConversations.find((c : any) => c.id === response.conversationId);
          if (newConversation) {
            setSelectedConversation(newConversation);
          }
        } else {
          const updatedConversations = await chatService.listConversations(user.chatId);
          setConversations(updatedConversations);
          const newConversation = updatedConversations.find(c => c.id === response.conversationId);
          if (newConversation) {
            setSelectedConversation(newConversation);
          }
        }
      }

      const answers = response.answers || [];

      if (answers.length === 0) {
        const emptyMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Desculpe, não consegui gerar uma resposta.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, emptyMessage]);
        setIsLoading(false);
        return;
      }

      const fullAnswer = answers.join('\n\n');
      const assistantMessageId = (Date.now() + 1).toString();

      const initialMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, initialMessage]);

      let currentCharIndex = 0;

      const streamInterval = setInterval(() => {
        if (currentCharIndex >= fullAnswer.length) {
          clearInterval(streamInterval);
          setIsLoading(false);
          return;
        }

        const charsToAdd = Math.min(3, fullAnswer.length - currentCharIndex);
        currentCharIndex += charsToAdd;

        const currentContent = fullAnswer.substring(0, currentCharIndex);

        setMessages((prev) => prev.map(msg =>
          msg.id === assistantMessageId
            ? { ...msg, content: currentContent }
            : msg
        ));
      }, 30);
    } catch (error: any) {
      setIsLoading(false);
      setMessages((prev) => prev.map(msg =>
        msg.id === messageId ? { ...msg, status: 'error' as const } : msg
      ));

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Desculpe, ocorreu um erro ao processar sua mensagem: ${error.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
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
    setMessages([]);
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

  const handleMessageFeedback = async (
    messageId: string,
    type: 'positive' | 'negative' | 'report',
    comment?: string
  ) => {
    if (!user || !selectedConversation) return;

    try {
      let parsedComment;
      if (comment) {
        try {
          parsedComment = JSON.parse(comment);
        } catch {
          parsedComment = { comment };
        }
      }

      await feedbackService.submitMessageFeedback({
        messageId,
        conversationId: selectedConversation.id,
        type,
        issues: parsedComment?.issues,
        comment: parsedComment?.comment || comment,
        userId: user.id
      });

      console.log(`Feedback ${type} enviado para mensagem ${messageId}`);
    } catch (error: any) {
      console.error('Erro ao enviar feedback:', error);
    }
  };

  return (
    <div className="flex h-screen bg-[#FFDE14] dark:bg-[#121212] overflow-hidden transition-all duration-700 relative">

      <div className="fixed top-4 right-4 z-50 flex gap-3">
        <button
          onClick={() => {
            const currentUser = user;
            if (currentUser) {
              const updatedUser = { ...currentUser, role: 'admin' as const };
              localStorage.setItem('askia-user', JSON.stringify(updatedUser));
              window.location.href = '/admin';
            }
          }}
          className="p-3 rounded-full bg-purple-500/90 dark:bg-purple-600/90 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all hover:scale-110 active:scale-95 border-2 border-transparent hover:border-purple-700"
          aria-label="Acessar Admin"
          title="Acessar Dashboard Admin"
        >
          <Shield className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all hover:scale-110 active:scale-95 border-2 border-transparent hover:border-blue-500 dark:hover:border-[#FFDE14]"
          aria-label="Alternar tema"
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6 text-yellow-500 animate-spin-slow" />
          ) : (
            <Moon className="w-6 h-6 text-gray-900 animate-pulse" />
          )}
        </button>
      </div>

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
          isLoading={isLoading}
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
              onMessageFeedback={handleMessageFeedback}
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
