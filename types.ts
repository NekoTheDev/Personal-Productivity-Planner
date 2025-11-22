export type Frequency = 'daily' | 'weekly';

export interface Habit {
  id: string;
  name: string;
  frequency: Frequency;
  completedDates: string[]; // Stores dates in YYYY-MM-DD format
  createdAt: string;
  category: 'health' | 'learning' | 'mindfulness' | 'productivity' | 'other';
}

export interface WeeklySummary {
  totalCompleted: number;
  completionRate: number;
  message: string;
}

export interface ChartDataPoint {
  date: string; // MM/DD
  completed: number;
  total: number;
}
