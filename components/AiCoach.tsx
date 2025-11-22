import React, { useState } from 'react';
import { getMotivationalFeedback } from '../services/geminiService';
import { Habit } from '../types';

interface AiCoachProps {
  habits: Habit[];
  chartData: { date: string; completedCount: number }[];
}

export const AiCoach: React.FC<AiCoachProps> = ({ habits, chartData }) => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetAdvice = async () => {
    setLoading(true);
    const result = await getMotivationalFeedback(habits, chartData);
    setFeedback(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-yellow-300 opacity-20 rounded-full blur-xl"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
            <i className="fas fa-robot"></i>
            Trợ lý Động Lực AI
            </h3>
            {!feedback && (
                <button
                onClick={handleGetAdvice}
                disabled={loading}
                className="bg-white/20 hover:bg-white/30 text-white text-sm font-semibold py-1.5 px-3 rounded-lg transition-all disabled:opacity-50"
                >
                {loading ? 'Đang suy nghĩ...' : 'Nhận lời khuyên tuần này'}
                </button>
            )}
        </div>

        {loading ? (
            <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-white/20 rounded w-3/4"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-white/20 rounded"></div>
                        <div className="h-4 bg-white/20 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        ) : feedback ? (
            <div className="prose prose-invert max-w-none text-sm leading-relaxed bg-black/10 p-4 rounded-lg border border-white/10">
                <div className="whitespace-pre-line">{feedback}</div>
                <button 
                    onClick={() => setFeedback(null)}
                    className="mt-4 text-xs text-indigo-200 hover:text-white underline"
                >
                    Đóng lời khuyên
                </button>
            </div>
        ) : (
            <p className="text-indigo-100 text-sm opacity-90">
                Bấm vào nút phía trên để AI xem xét tiến độ tuần này và gửi tặng bạn những lời động viên "đúng người, đúng thời điểm" nhé!
            </p>
        )}
      </div>
    </div>
  );
};