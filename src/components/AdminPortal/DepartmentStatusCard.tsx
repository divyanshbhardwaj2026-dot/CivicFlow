import React from 'react';
import { Building2, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { Department, DepartmentMetric } from '../../types';

interface DepartmentStatusCardProps {
  departments: Department[];
  departmentMetrics?: DepartmentMetric[];
  selectedDepartment?: string;
  onSelectDepartment?: (deptId: string) => void;
}

export const DepartmentStatusCard: React.FC<DepartmentStatusCardProps> = ({
  departments,
  departmentMetrics,
  selectedDepartment,
  onSelectDepartment,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs font-sans space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-700" />
          <h3 className="font-bold text-sm text-slate-900">Departmental Workload &amp; Health</h3>
        </div>
        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          {departments.length} Units
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {departments.map(dept => {
          const isSelected = selectedDepartment === dept.id;
          const metric = departmentMetrics?.find(m => m.department_id === dept.id);
          const pendingCount = metric?.pending || (dept as any).open_complaints_count || 8;
          const officersCount = metric?.officers_count || (dept as any).active_officers_count || 4;

          return (
            <div
              key={dept.id}
              onClick={() => onSelectDepartment && onSelectDepartment(isSelected ? 'all' : dept.id)}
              className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-50/70 border-blue-300 shadow-2xs'
                  : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-slate-900 line-clamp-1">{dept.name}</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {(dept as any).sla_hours || 24}h SLA
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-slate-400" />
                  {officersCount} Field Staff
                </span>
                <span className="text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  {pendingCount} Open
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
