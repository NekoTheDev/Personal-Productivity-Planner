import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartDataPoint } from '../types';

interface ProgressChartProps {
  data: ChartDataPoint[];
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80">
      <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
        <i className="fas fa-chart-line text-brand-500"></i>
        Tiến độ 7 ngày qua
      </h3>
      {data.length === 0 || data.every(d => d.completed === 0) ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 pb-10">
              <i className="fas fa-seedling text-4xl mb-2 opacity-50"></i>
              <p>Chưa có dữ liệu. Hãy tích vào thói quen hôm nay nhé!</p>
          </div>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
            <BarChart data={data}>
            <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                dy={10}
            />
            <YAxis hide />
            <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="completed" radius={[6, 6, 0, 0]} animationDuration={1000}>
                {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.completed >= entry.total && entry.total > 0 ? '#14b8a6' : '#fbbf24'} />
                ))}
            </Bar>
            </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};