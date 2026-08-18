import React from 'react';
import { Building2, MapPin } from 'lucide-react';
import { CityMetric } from '../../types';

interface CityAnalyticsChartProps {
  cities: CityMetric[];
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
}

export const CityAnalyticsChart: React.FC<CityAnalyticsChartProps> = ({
  cities,
  selectedCity,
  onSelectCity,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between font-sans">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-700" />
            <h3 className="font-bold text-sm text-slate-900">Municipal Corporation Performance</h3>
          </div>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {cities.length} Hubs
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Comparative resolution rate across connected smart city municipal zones.
        </p>

        <div className="space-y-3">
          {cities.map(city => {
            const cityName = city.city || (city as any).city_name || 'City';
            const isSelected = selectedCity === cityName;
            const pendingCount = city.pending ?? (city as any).pending_count ?? 0;

            return (
              <div
                key={city.city_id}
                onClick={() => onSelectCity && onSelectCity(isSelected ? 'all' : cityName)}
                className={`p-3 rounded-lg transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-300 shadow-2xs'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-slate-900">{cityName}</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-slate-600">{city.total_complaints} total</span>
                    <span className="text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      {pendingCount} pending
                    </span>
                    <span className="text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      {city.resolution_rate}% resolved
                    </span>
                  </div>
                </div>

                {/* Resolution progress bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-700 transition-all duration-300"
                    style={{ width: `${city.resolution_rate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Highest resolution velocity: <strong className="text-slate-800">Bengaluru (92%)</strong></span>
      </div>
    </div>
  );
};
