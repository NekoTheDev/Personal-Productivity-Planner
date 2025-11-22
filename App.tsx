import React, { useState, useEffect, useMemo } from 'react';
import { HabitForm } from './components/HabitForm';
import { ProgressChart } from './components/ProgressChart';
import { AiCoach } from './components/AiCoach';
import { Habit, ChartDataPoint } from './types';

const App: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [];
  });

  const [today] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (habitData: Omit<Habit, 'id' | 'completedDates' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    setHabits((prev) => [newHabit, ...prev]);
  };

  const toggleHabit = (id: string) => {
    setHabits((prev) => prev.map(habit => {
      if (habit.id !== id) return habit;
      
      const isCompletedToday = habit.completedDates.includes(today);
      let newDates;
      
      if (isCompletedToday) {
        newDates = habit.completedDates.filter(d => d !== today);
      } else {
        newDates = [...habit.completedDates, today];
      }
      
      return { ...habit, completedDates: newDates };
    }));
  };

  const deleteHabit = (id: string) => {
      if(window.confirm("Bạn có chắc chắn muốn xóa thói quen này không?")) {
        setHabits(prev => prev.filter(h => h.id !== id));
      }
  }

  // Calculate Chart Data (Last 7 Days)
  const chartData: ChartDataPoint[] = useMemo(() => {
    const data: ChartDataPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
      const label = `${d.getDate()}/${d.getMonth() + 1}`;
      
      let completedCount = 0;
      let totalHabitsActive = 0;

      habits.forEach(h => {
          // Check if habit existed on this date (simple check created date)
          if (h.createdAt.split('T')[0] <= dateStr) {
            totalHabitsActive++;
            if (h.completedDates.includes(dateStr)) {
                completedCount++;
            }
          }
      });

      data.push({
        date: label,
        completed: completedCount,
        total: totalHabitsActive
      });
    }
    return data;
  }, [habits]);

  // Transform data for AI service
  const aiStats = chartData.map(d => ({ date: d.date, completedCount: d.completed }));

  const getIcon = (category: Habit['category']) => {
      switch(category) {
          case 'health': return 'fa-heart-pulse';
          case 'learning': return 'fa-book-open';
          case 'mindfulness': return 'fa-spa';
          case 'productivity': return 'fa-bolt';
          default: return 'fa-star';
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                    <i className="fas fa-check"></i>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Tích Cực Mỗi Ngày</h1>
                    <p className="text-xs text-slate-500">Xây dựng phiên bản tốt nhất của bạn</p>
                </div>
            </div>
            <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Habits List */}
        <div className="md:col-span-2 space-y-6">
            <section>
                <div className="flex justify-between items-end mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Danh sách hôm nay</h2>
                    <span className="text-sm text-brand-600 font-medium bg-brand-50 px-2 py-1 rounded-md">
                        {habits.filter(h => h.completedDates.includes(today)).length}/{habits.length} hoàn thành
                    </span>
                </div>
                
                <HabitForm onAdd={addHabit} />

                <div className="space-y-3">
                    {habits.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300">
                            <i className="fas fa-wind text-4xl text-slate-300 mb-3"></i>
                            <p className="text-slate-500">Chưa có thói quen nào. Hãy thêm mới nhé!</p>
                        </div>
                    ) : (
                        habits.map(habit => {
                            const isCompleted = habit.completedDates.includes(today);
                            return (
                                <div 
                                    key={habit.id}
                                    className={`group flex items-center justify-between p-4 bg-white rounded-xl border transition-all duration-300 hover:shadow-md ${isCompleted ? 'border-brand-200 bg-brand-50/30' : 'border-slate-100'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={() => toggleHabit(habit.id)}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted ? 'bg-brand-500 text-white scale-110 shadow-lg shadow-brand-500/40' : 'bg-slate-100 text-slate-300 hover:bg-slate-200'}`}
                                        >
                                            <i className="fas fa-check text-sm"></i>
                                        </button>
                                        <div>
                                            <h3 className={`font-semibold text-lg transition-colors ${isCompleted ? 'text-brand-700 line-through opacity-70' : 'text-slate-700'}`}>
                                                {habit.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <i className={`fas ${getIcon(habit.category)}`}></i>
                                                <span className="capitalize">{habit.frequency === 'daily' ? 'Hàng ngày' : 'Hàng tuần'}</span>
                                                <span>•</span>
                                                <span className="text-orange-500 flex items-center gap-1">
                                                    <i className="fas fa-fire"></i>
                                                    {/* Simplistic streak calculation could go here */}
                                                    {habit.completedDates.length} ngày đã làm
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => deleteHabit(habit.id)}
                                        className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 p-2 transition-opacity"
                                        title="Xóa thói quen"
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>
        </div>

        {/* Right Column: Stats & AI */}
        <div className="space-y-6">
            <section>
                <AiCoach habits={habits} chartData={aiStats} />
            </section>
            
            <section>
                <ProgressChart data={chartData} />
            </section>

            <section className="bg-gradient-to-r from-orange-100 to-amber-100 p-5 rounded-xl border border-orange-200">
                <h3 className="text-orange-800 font-bold mb-2 text-sm uppercase tracking-wide">Lời nhắc nhỏ</h3>
                <p className="text-orange-700 text-sm italic">
                    "Kỷ luật là cầu nối giữa mục tiêu và thành tựu. Cố lên bạn nhé!"
                </p>
            </section>
        </div>
      </main>
    </div>
  );
};

export default App;