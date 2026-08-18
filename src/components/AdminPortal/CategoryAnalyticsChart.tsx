import React from 'react';
import { Layers, TrendingUp, AlertTriangle } from 'lucide-react';
import { CategoryMetric, Category } from '../../types';

interface CategoryAnalyticsChartProps {
  categories: CategoryMetric[];
  selectedCategory?: string;
  onSelectCategory?: (cat: string) => void;
}

export const CategoryAnalyticsChart: React.FC<CategoryAnalyticsChartProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const maxCount = Math.max(...categories.map(c => c.count), 1);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between font-sans">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-700" />
            <h3 className="font-bold text-sm text-slate-900">Category Grievance Distribution</h3>
          </div>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            Live Feed
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Concentration of incoming citizen grievances across municipal departments.
        </p>

        <div className="space-y-3">
          {categories.slice(0, 6).map(item => {
            const isSelected = selectedCategory === item.category;
            const barWidth = Math.max(8, Math.round((item.count / maxCount) * 100));

            return (
              <div
                key={item.category}
                onClick={() => onSelectCategory && onSelectCategory(isSelected ? 'all' : item.category)}
                className={`p-2.5 rounded-lg transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-300 shadow-2xs'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-800 truncate max-w-[180px]">
                    {item.display_name}
                  </span>

                  <div className="flex items-center gap-2">
                    {item.critical_count > 0 && (
                      <span className="text-[10px] text-rose-800 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 flex items-center gap-0.5">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        {item.critical_count} crit
                      </span>
                    )}
                    <span className="font-mono font-bold text-slate-900">{item.count}</span>
                    <span className="text-[11px] text-slate-500 font-mono">({item.percentage}%)</span>
                  </div>
                </div>

                {/* Clean Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-slate-800 transition-all duration-300"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1 text-slate-700 font-medium">
          <TrendingUp className="w-3 h-3 text-blue-700" />
          Water Supply &amp; Sanitation represent 55% of all active complaints
        </span>
      </div>
    </div>
  );
};
