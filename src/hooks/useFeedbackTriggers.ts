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

  const TRIGGERS = {
    AFTER_EVERY_N_RESPONSES: 6,
    PERIODIC_CHECK: 8,
    NEW_CONVERSATION_DELAY: 4,
    BEFORE_NEW_CHAT_THRESHOLD: 6,
    MIN_TIME_BETWEEN_PROMPTS: 120000,
  };

  const canShowPrompt = useCallback((convId: string) => {
    if (!convId) return false;

    const history = feedbackHistory[convId];
    if (!history) return true;

    const timeSinceLastFeedback = Date.now() - history.lastFeedbackAt;
    return timeSinceLastFeedback >= TRIGGERS.MIN_TIME_BETWEEN_PROMPTS;
  }, [feedbackHistory, TRIGGERS.MIN_TIME_BETWEEN_PROMPTS]);

  const isTriggerCompleted = useCallback((convId: string, triggerType: string) => {
    const history = feedbackHistory[convId];
    return history?.completedTriggers.includes(triggerType) || false;
  }, [feedbackHistory]);

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

  const dismissTrigger = useCallback(() => {
    setActiveTrigger(null);
  }, []);

  const triggerBeforeNewChat = useCallback((currentConvId: string) => {
    if (!currentConvId || messageCount < TRIGGERS.BEFORE_NEW_CHAT_THRESHOLD) {
      return false;
    }

    if (isTriggerCompleted(currentConvId, 'before_new_chat')) {
      return false; 
    }

    setActiveTrigger({
      type: 'before_new_chat',
      conversationId: currentConvId,
      priority: 'high'
    });

    return true;
  }, [messageCount, isTriggerCompleted, TRIGGERS.BEFORE_NEW_CHAT_THRESHOLD]);

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
