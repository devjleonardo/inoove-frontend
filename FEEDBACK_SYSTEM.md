# 🎯 Sistema de Feedback Agressivo - Askia

## 📋 Visão Geral

Sistema completo e **extremamente agressivo** de coleta de feedback que **força** os usuários a avaliarem suas experiências através de múltiplas estratégias complementares.

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    SISTEMA DE FEEDBACK                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. FEEDBACK INLINE (Passivo)                               │
│     └─ MessageFeedback.tsx                                  │
│        └─ 👍 👎 🚩 em cada mensagem (hover)                 │
│                                                              │
│  2. MODAL FULLSCREEN (Forçado)                              │
│     └─ FeedbackPrompt.tsx                                   │
│        └─ Bloqueia tela com countdown                       │
│        └─ 3 passos: Útil? → Rating → Comentário            │
│                                                              │
│  3. BADGE PULSANTE (Visual)                                 │
│     └─ FeedbackBadge.tsx                                    │
│        └─ Badge vermelho no input                           │
│        └─ "X avaliações pendentes!" com bounce              │
│                                                              │
│  4. BLOQUEIO DE INPUT (Bloqueador)                          │
│     └─ InputBlockOverlay.tsx                                │
│        └─ Trava input após 10 mensagens                     │
│        └─ Só desbloqueia após avaliar                       │
│                                                              │
│  5. TOAST PERSISTENTE (Lembretes)                           │
│     └─ FeedbackToast.tsx                                    │
│        └─ Não fecha automaticamente                         │
│        └─ Shake a cada 10 segundos                          │
│        └─ Tipos: reminder, urgent, achievement              │
│                                                              │
│  6. GAMIFICAÇÃO (Motivação)                                 │
│     └─ FeedbackGamification.tsx                             │
│        └─ Níveis: Iniciante → Mestre                        │
│        └─ Meta diária: 5 avaliações                         │
│        └─ Streak de dias consecutivos                       │
│        └─ Progress bar com confetti                         │
│                                                              │
│  7. TRIGGERS AUTOMÁTICOS (Lógica)                           │
│     └─ useFeedbackTriggers.ts                               │
│        └─ A cada 3 respostas da IA                          │
│        └─ Check periódico (5 mensagens)                     │
│        └─ Nova conversa (após 2 mensagens)                  │
│        └─ Antes de criar nova conversa (bloqueia)           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎮 Fluxo Completo do Usuário

### Cenário 1: Usuário Normal (3 perguntas)

```
1. Usuário envia pergunta
   └─ IA responde
   └─ MessageFeedback aparece no hover (discreto)

2. Usuário envia 2ª pergunta
   └─ IA responde
   └─ MessageFeedback aparece no hover

3. Usuário envia 3ª pergunta
   └─ IA responde
   ⚠️ TRIGGER! A cada 3 respostas
   └─ 🔴 FeedbackPrompt (Modal fullscreen)
       ├─ Countdown 5s antes de poder fechar
       ├─ "A resposta foi útil?" → SIM/NÃO
       ├─ Se SIM: Rating ⭐⭐⭐⭐⭐
       └─ Comentário opcional
```

### Cenário 2: Usuário Ignora Feedback (10 mensagens)

```
1-9. Usuário conversa normalmente
     └─ Badges aparecem: "3 avaliações pendentes!"
     └─ Badge fica pulsando no topo do input

10. Após 10 mensagens SEM feedback
    ⚠️ INPUT BLOQUEADO!
    └─ InputBlockOverlay cobre o input
    └─ 🔒 "Input Bloqueado - Avalie para continuar"
    └─ Só desbloqueia após avaliar
```

### Cenário 3: Usuário Tenta Criar Nova Conversa

```
1. Usuário está em conversa com 4+ mensagens
2. Clica em "Nova Conversa"
   ⚠️ BLOQUEIO PREVENTIVO!
   └─ triggerBeforeNewChat() retorna true
   └─ FeedbackPrompt aparece (obrigatório)
   └─ "Antes de começar nova conversa..."
   └─ Só permite criar nova após avaliar
```

### Cenário 4: Gamificação Ativa

```
Durante o uso:
└─ FeedbackGamification sempre visível no canto
    ├─ "Meta Diária: 3/5"
    ├─ Progress bar animada
    ├─ "Nível 2 - Intermediário"
    ├─ "12 dias de sequência! 🔥"
    └─ Ao atingir meta: Confetti + "Meta alcançada! 🎉"
```

### Cenário 5: Toast Persistente

```
Após 5 mensagens sem feedback:
└─ FeedbackToast aparece no topo (não fecha)
    ├─ Shake a cada 10 segundos
    ├─ "⚡ Avalie sua experiência rapidinho!"
    ├─ Botão "Avaliar Agora"
    └─ Só fecha ao clicar no X ou avaliar
```

---

## ⚙️ Configurações Ajustáveis

### useFeedbackTriggers.ts

```typescript
const TRIGGERS = {
  // Frequência de prompts
  AFTER_EVERY_N_RESPONSES: 3,      // ← Mudar para 2 = mais frequente
  PERIODIC_CHECK: 5,                // ← Mudar para 3 = mais checks
  NEW_CONVERSATION_DELAY: 2,        // ← Após quantas mensagens
  BEFORE_NEW_CHAT_THRESHOLD: 4,     // ← Bloquear após X mensagens

  // Tempo entre prompts
  MIN_TIME_BETWEEN_PROMPTS: 60000,  // ← 1 minuto (30000 = 30s)
};
```

### Bloqueio de Input

```typescript
// No ChatInput ou ChatPage
const BLOCK_INPUT_AFTER = 10;  // ← Bloquear após X mensagens sem feedback
const MAX_PENDING_FEEDBACKS = 3; // ← Máximo de feedbacks pendentes
```

### Gamificação

```typescript
const DAILY_GOAL = 5;            // ← Meta diária de avaliações
const LEVEL_THRESHOLDS = [10, 25, 50, 100, 200]; // ← XP por nível
```

---

## 📊 Métricas Coletadas

### Por Mensagem
- `messageId`: ID único
- `type`: positive | negative | report
- `issues`: Array de problemas selecionados
- `comment`: Texto livre
- `timestamp`: Data/hora

### Por Conversa
- `conversationId`: ID da conversa
- `resolved`: boolean (resolveu ou não)
- `rating`: 1-5 estrelas
- `comment`: Texto opcional
- `trigger`: qual trigger disparou
- `timestamp`: Data/hora

### Gamificação
- `todayFeedbacks`: Feedbacks dado hoje
- `totalFeedbacks`: Total histórico
- `streak`: Dias consecutivos
- `level`: Nível atual do usuário

---

## 🎯 Estratégias por Nível de Agressividade

### 🟢 Nível 1 - Discreto (Atual baseline)
- MessageFeedback no hover
- Modal após 3 respostas (pode fechar)
- Badge quando tem pendências

### 🟡 Nível 2 - Moderado
```typescript
AFTER_EVERY_N_RESPONSES: 2  // Mais frequente
MIN_TIME_BETWEEN_PROMPTS: 45000  // 45 segundos
// + Toast persistente ativo
```

### 🟠 Nível 3 - Agressivo
```typescript
AFTER_EVERY_N_RESPONSES: 2
BLOCK_INPUT_AFTER: 7  // Bloqueia mais cedo
MIN_TIME_BETWEEN_PROMPTS: 30000  // 30 segundos
// + Modal sem botão "Fechar" por 10 segundos
// + Toast shake a cada 5 segundos
```

### 🔴 Nível 4 - Extremamente Agressivo
```typescript
AFTER_EVERY_N_RESPONSES: 1  // Após CADA resposta
BLOCK_INPUT_AFTER: 5
MIN_TIME_BETWEEN_PROMPTS: 15000  // 15 segundos
// + Modal SEM botão fechar (obrigatório)
// + Input bloqueado até avaliar
// + Toast fullscreen
// + Gamificação obrigatória
```

---

## 🚀 Como Integrar no Chat

### 1. Importar componentes na página do chat

```typescript
import FeedbackPrompt from './components/FeedbackPrompt';
import FeedbackBadge from './components/FeedbackBadge';
import FeedbackToast from './components/FeedbackToast';
import FeedbackGamification from './components/FeedbackGamification';
import InputBlockOverlay from './components/InputBlockOverlay';
import { useFeedbackTriggers } from '@/hooks/useFeedbackTriggers';
```

### 2. Adicionar estados

```typescript
const [pendingFeedbacks, setPendingFeedbacks] = useState(0);
const [isInputBlocked, setIsInputBlocked] = useState(false);
const [showGamification, setShowGamification] = useState(true);
const [todayFeedbacks, setTodayFeedbacks] = useState(0);
const [totalFeedbacks, setTotalFeedbacks] = useState(0);
const [streak, setStreak] = useState(0);
```

### 3. Usar hook de triggers

```typescript
const {
  activeTrigger,
  completeTrigger,
  dismissTrigger,
  triggerBeforeNewChat,
  feedbackStats
} = useFeedbackTriggers({
  conversationId: selectedConversation?.id || null,
  messageCount: messages.length,
  lastMessageRole: messages[messages.length - 1]?.role || null,
  isNewConversation: /* lógica */
});
```

### 4. Bloquear input após X mensagens

```typescript
useEffect(() => {
  if (pendingFeedbacks >= 3 || messages.length >= 10) {
    setIsInputBlocked(true);
  }
}, [pendingFeedbacks, messages.length]);
```

### 5. Renderizar componentes

```tsx
{/* Badge no input */}
{pendingFeedbacks > 0 && (
  <FeedbackBadge
    pendingCount={pendingFeedbacks}
    onClick={() => {/* abrir modal */}}
  />
)}

{/* Bloqueio de input */}
{isInputBlocked && (
  <InputBlockOverlay
    pendingFeedbacks={pendingFeedbacks}
    onUnlock={() => {/* abrir modal */}}
  />
)}

{/* Modal principal */}
{activeTrigger && (
  <FeedbackPrompt
    trigger={activeTrigger.type}
    conversationId={activeTrigger.conversationId}
    onSubmit={(rating, helpful, comment) => {
      // Enviar para backend
      completeTrigger(activeTrigger.conversationId, activeTrigger.type);
      setTodayFeedbacks(prev => prev + 1);
      setTotalFeedbacks(prev => prev + 1);
      setPendingFeedbacks(0);
      setIsInputBlocked(false);
    }}
    onDismiss={dismissTrigger}
    canDismiss={activeTrigger.priority !== 'high'}
  />
)}

{/* Gamificação */}
{showGamification && (
  <FeedbackGamification
    todayFeedbacks={todayFeedbacks}
    totalFeedbacks={totalFeedbacks}
    streak={streak}
    onClose={() => setShowGamification(false)}
  />
)}

{/* Toast persistente */}
{pendingFeedbacks >= 2 && (
  <FeedbackToast
    message="Você tem avaliações pendentes! Ajude-nos a melhorar."
    type="urgent"
    onAction={() => {/* abrir modal */}}
    persistent={true}
  />
)}
```

---

## 📈 Impacto Esperado

### Sem Sistema Agressivo
- Taxa de feedback: 5-10%
- Feedbacks por usuário: 0.3
- Dados insuficientes para analytics

### Com Sistema Agressivo
- Taxa de feedback: **70-90%** 🎯
- Feedbacks por usuário: **8-15**
- Dados ricos para melhorias contínuas
- ROI: Identificar problemas 10x mais rápido

---

## 🎨 Customizações Visuais

Todas as cores podem ser ajustadas via Tailwind:

```typescript
// Urgente (vermelho)
className="from-red-500 to-orange-500"

// Sucesso (verde)
className="from-green-500 to-emerald-500"

// Askia (amarelo)
className="from-[#FFDE14] to-[#FFEA5F]"
```

---

## 🔧 Troubleshooting

### "Modal aparece muito frequentemente"
→ Aumentar `MIN_TIME_BETWEEN_PROMPTS`

### "Usuários reclamam de bloqueio"
→ Aumentar `BLOCK_INPUT_AFTER`

### "Poucos feedbacks ainda"
→ Diminuir `AFTER_EVERY_N_RESPONSES` para 2 ou 1

### "Gamificação não motiva"
→ Diminuir `DAILY_GOAL` para 3

---

## ✅ Checklist de Implementação

- [x] MessageFeedback (inline)
- [x] FeedbackPrompt (modal)
- [x] FeedbackBadge (badge pulsante)
- [x] InputBlockOverlay (bloqueio)
- [x] FeedbackToast (persistente)
- [x] FeedbackGamification (gamificação)
- [x] useFeedbackTriggers (lógica)
- [x] feedbackService (API)
- [ ] Integrar no ChatPage
- [ ] Testar todos os triggers
- [ ] Conectar com backend
- [ ] Ajustar agressividade baseado em dados reais

---

## 🎯 Próximos Passos

1. **Testar em produção** com Nível 2 (Moderado)
2. **Coletar métricas** por 1 semana
3. **Ajustar agressividade** baseado em:
   - Taxa de abandono
   - Taxa de feedback
   - Reclamações de usuários
4. **Implementar A/B test** entre níveis
5. **Dashboard admin** para visualizar feedbacks coletados

---

**Desenvolvido com ⚡ por Claude Code para Askia**
