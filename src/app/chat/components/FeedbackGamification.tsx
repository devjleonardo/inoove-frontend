'use client';

import { Trophy, Target, Zap, Star, TrendingUp, Award, Flame } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FeedbackGamificationProps {
  todayFeedbacks: number;
  totalFeedbacks: number;
  streak: number;
  onClose: () => void;
}

export default function FeedbackGamification({
  todayFeedbacks,
  totalFeedbacks,
  streak,
  onClose
}: FeedbackGamificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  const DAILY_GOAL = 5;
  const progress = Math.min((todayFeedbacks / DAILY_GOAL) * 100, 100);
  const isGoalReached = todayFeedbacks >= DAILY_GOAL;

  useEffect(() => {
    if (isGoalReached) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [isGoalReached]);

  const getLevel = () => {
    if (totalFeedbacks >= 100) return { level: 5, name: 'Mestre', color: 'from-purple-500 to-pink-500' };
    if (totalFeedbacks >= 50) return { level: 4, name: 'Expert', color: 'from-blue-500 to-cyan-500' };
    if (totalFeedbacks >= 25) return { level: 3, name: 'Avançado', color: 'from-green-500 to-emerald-500' };
    if (totalFeedbacks >= 10) return { level: 2, name: 'Intermediário', color: 'from-yellow-500 to-orange-500' };
    return { level: 1, name: 'Iniciante', color: 'from-gray-400 to-gray-500' };
  };

  const level = getLevel();
  const nextLevelThreshold = [10, 25, 50, 100, 200][level.level - 1] || 200;

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-8 duration-500">
      
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 animate-confetti"
              style={{
                left: '50%',
                top: '50%',
                backgroundColor: ['#FFDE14', '#00ff00', '#0000ff', '#ff00ff'][i % 4],
                animationDelay: `${i * 0.1}s`,
                transform: `rotate(${i * 18}deg) translateY(-100px)`
              }}
            />
          ))}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-[#FFDE14] dark:border-[#FFDE14] p-6 w-80 relative overflow-hidden">
        
        <div className="absolute inset-0 opacity-5 dark:opacity-10"
             style={{
               backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)',
               backgroundSize: '20px 20px',
               backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
             }}
        />

        
        <div className="relative mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${level.color}`}>
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Nível {level.level}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {level.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              ✕
            </button>
          </div>

          
          {streak > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              <span className="text-sm font-bold text-orange-700 dark:text-orange-400">
                {streak} {streak === 1 ? 'dia' : 'dias'} de sequência! 🔥
              </span>
            </div>
          )}
        </div>

        
        <div className="relative mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#FFDE14]" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Meta Diária
              </span>
            </div>
            <span className={`text-sm font-bold ${isGoalReached ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
              {todayFeedbacks}/{DAILY_GOAL}
            </span>
          </div>

          
          <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                isGoalReached
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-gradient-to-r from-[#FFDE14] to-[#FFEA5F]'
              }`}
              style={{ width: `${progress}%` }}
            >
              {progress > 20 && (
                <div className="absolute inset-0 flex items-center justify-end pr-2">
                  <span className="text-xs font-bold text-white drop-shadow">
                    {Math.round(progress)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {isGoalReached && (
            <div className="mt-2 flex items-center gap-2 text-green-600 dark:text-green-400 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Award className="w-4 h-4" />
              <span className="text-xs font-bold">Meta alcançada! 🎉</span>
            </div>
          )}
        </div>

        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalFeedbacks}
            </p>
          </div>

          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Próx. Nível</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {nextLevelThreshold - totalFeedbacks}
            </p>
          </div>
        </div>

        
        <div className="p-3 bg-gradient-to-r from-[#FFDE14]/20 to-[#FFEA5F]/20 dark:from-[#FFDE14]/10 dark:to-[#FFEA5F]/10 rounded-lg border border-[#FFDE14]/30">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-[#FFDE14] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-700 dark:text-gray-300">
              {todayFeedbacks === 0 && "Comece hoje! Cada avaliação nos ajuda a melhorar."}
              {todayFeedbacks > 0 && todayFeedbacks < 3 && "Ótimo começo! Continue avaliando."}
              {todayFeedbacks >= 3 && todayFeedbacks < 5 && "Quase lá! Mais algumas avaliações."}
              {todayFeedbacks >= 5 && "Incrível! Você é um super avaliador! 🌟"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
