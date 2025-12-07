import { useState, useEffect, useCallback } from 'react';

interface FeedbackTrigger {
  type: 'after_response' | 'periodic' | 'new_conversation' | 'before_new_chat';
  messageId?: string;
  conversationId: string;
  priority: 'low' | 'medium' | 'high';
}

interface UseFeedbackTriggersOptions {
  conversationId: string | null;
  messageCount: number;
  lastMessageRole: 'user' | 'assistant' | null;
  isNewConversation: boolean;
}

export function useFeedbackTriggers({
  conversationId,
  messageCount,
  lastMessageRole,
  isNewConversation
}: UseFeedbackTriggersOptions) {
  const [activeTrigger, setActiveTrigger] = useState<FeedbackTrigger | null>(null);
  const [feedbackHistory, setFeedbackHistory] = useState<{
    [conversationId: string]: {
      count: number;
      lastFeedbackAt: number;
      completedTriggers: string[];
    };
  }>({});

  // Configurações de trigger
  const TRIGGERS = {
    AFTER_EVERY_N_RESPONSES: 3, // A cada 3 respostas da IA
    PERIODIC_CHECK: 5, // A cada 5 mensagens totais
    NEW_CONVERSATION_DELAY: 2, // Após 2 mensagens em nova conversa
    BEFORE_NEW_CHAT_THRESHOLD: 4, // Se tem 4+ mensagens e tenta criar nova
    MIN_TIME_BETWEEN_PROMPTS: 60000, // 1 minuto entre prompts (ms)
  };

  // Verifica se pode mostrar prompt (respeita intervalo mínimo)
  const canShowPrompt = useCallback((convId: string) => {
    if (!convId) return false;

    const history = feedbackHistory[convId];
    if (!history) return true;

    const timeSinceLastFeedback = Date.now() - history.lastFeedbackAt;
    return timeSinceLastFeedback >= TRIGGERS.MIN_TIME_BETWEEN_PROMPTS;
  }, [feedbackHistory, TRIGGERS.MIN_TIME_BETWEEN_PROMPTS]);

  // Verifica se trigger já foi completado nesta conversa
  const isTriggerCompleted = useCallback((convId: string, triggerType: string) => {
    const history = feedbackHistory[convId];
    return history?.completedTriggers.includes(triggerType) || false;
  }, [feedbackHistory]);

  // Trigger 1: Após cada N respostas
  useEffect(() => {
    if (!conversationId || !lastMessageRole || lastMessageRole !== 'assistant') return;

    const shouldTrigger =
      messageCount > 0 &&
      messageCount % TRIGGERS.AFTER_EVERY_N_RESPONSES === 0 &&
      canShowPrompt(conversationId) &&
      !isTriggerCompleted(conversationId, 'after_response');

    if (shouldTrigger) {
      setActiveTrigger({
        type: 'after_response',
        conversationId,
        priority: 'medium'
      });
    }
  }, [messageCount, lastMessageRole, conversationId, canShowPrompt, isTriggerCompleted, TRIGGERS.AFTER_EVERY_N_RESPONSES]);

  // Trigger 2: Check periódico
  useEffect(() => {
    if (!conversationId) return;

    const shouldTrigger =
      messageCount >= TRIGGERS.PERIODIC_CHECK &&
      messageCount % TRIGGERS.PERIODIC_CHECK === 0 &&
      canShowPrompt(conversationId) &&
      !isTriggerCompleted(conversationId, 'periodic');

    if (shouldTrigger) {
      setActiveTrigger({
        type: 'periodic',
        conversationId,
        priority: 'low'
      });
    }
  }, [messageCount, conversationId, canShowPrompt, isTriggerCompleted, TRIGGERS.PERIODIC_CHECK]);

  // Trigger 3: Nova conversa (após primeiras mensagens)
  useEffect(() => {
    if (!conversationId || !isNewConversation) return;

    const shouldTrigger =
      messageCount >= TRIGGERS.NEW_CONVERSATION_DELAY &&
      !isTriggerCompleted(conversationId, 'new_conversation');

    if (shouldTrigger) {
      setActiveTrigger({
        type: 'new_conversation',
        conversationId,
        priority: 'high'
      });
    }
  }, [messageCount, conversationId, isNewConversation, isTriggerCompleted, TRIGGERS.NEW_CONVERSATION_DELAY]);

  // Marcar trigger como completado
  const completeTrigger = useCallback((convId: string, triggerType: string) => {
    setFeedbackHistory(prev => ({
      ...prev,
      [convId]: {
        count: (prev[convId]?.count || 0) + 1,
        lastFeedbackAt: Date.now(),
        completedTriggers: [
          ...(prev[convId]?.completedTriggers || []),
          triggerType
        ]
      }
    }));
    setActiveTrigger(null);
  }, []);

  // Dismissar trigger atual
  const dismissTrigger = useCallback(() => {
    setActiveTrigger(null);
  }, []);

  // Trigger forçado antes de nova conversa
  const triggerBeforeNewChat = useCallback((currentConvId: string) => {
    if (!currentConvId || messageCount < TRIGGERS.BEFORE_NEW_CHAT_THRESHOLD) {
      return false; // Não precisa de feedback
    }

    if (isTriggerCompleted(currentConvId, 'before_new_chat')) {
      return false; // Já deu feedback
    }

    setActiveTrigger({
      type: 'before_new_chat',
      conversationId: currentConvId,
      priority: 'high'
    });

    return true; // Bloqueou ação, precisa de feedback
  }, [messageCount, isTriggerCompleted, TRIGGERS.BEFORE_NEW_CHAT_THRESHOLD]);

  // Estatísticas de feedback
  const getStats = useCallback(() => {
    const totalFeedbacks = Object.values(feedbackHistory).reduce(
      (sum, h) => sum + h.count,
      0
    );
    const conversationsWithFeedback = Object.keys(feedbackHistory).length;

    return {
      totalFeedbacks,
      conversationsWithFeedback,
      avgFeedbacksPerConversation: conversationsWithFeedback > 0
        ? (totalFeedbacks / conversationsWithFeedback).toFixed(1)
        : '0'
    };
  }, [feedbackHistory]);

  return {
    activeTrigger,
    completeTrigger,
    dismissTrigger,
    triggerBeforeNewChat,
    feedbackStats: getStats()
  };
}
