import React, { useState } from 'react';
import { Habit, Frequency } from '../types';

interface HabitFormProps {
  onAdd: (habit: Omit<Habit, 'id' | 'completedDates' | 'createdAt'>) => void;
}

export const HabitForm: React.FC<HabitFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('daily');
  const [category, setCategory] = useState<Habit['category']>('health');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name, frequency, category });
    setName('');
    setIsExpanded(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6 transition-all duration-300">
      {!isExpanded ? (
        <button 
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-center gap-2 text-brand-600 font-semibold py-2 hover:bg-brand-50 rounded-lg transition-colors"
        >
          <i className="fas fa-plus-circle text-xl"></i>
          <span>Thêm thói quen mới</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-bold text-slate-700">Tạo thói quen tích cực mới</h3>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Tên thói quen</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Đọc sách 15 phút, Uống nước..."
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                autoFocus
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Tần suất</label>
                    <select 
                        value={frequency} 
                        onChange={(e) => setFrequency(e.target.value as Frequency)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="daily">Hàng ngày</option>
                        <option value="weekly">Hàng tuần</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Danh mục</label>
                    <select 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value as Habit['category'])}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="health">Sức khỏe</option>
                        <option value="learning">Học tập</option>
                        <option value="mindfulness">Tâm trí</option>
                        <option value="productivity">Hiệu suất</option>
                        <option value="other">Khác</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button 
                    type="button" 
                    onClick={() => setIsExpanded(false)}
                    className="flex-1 py-2 px-4 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                >
                    Hủy
                </button>
                <button 
                    type="submit" 
                    className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium hover:from-brand-600 hover:to-brand-700 shadow-md transition-all transform active:scale-95"
                >
                    Bắt đầu ngay
                </button>
            </div>
        </form>
      )}
    </div>
  );
};