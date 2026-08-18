import React from 'react';
import { CheckCircle2, Clock, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { AIProcessingStep } from '../../types';

interface AIProcessingStepsProps {
  steps: AIProcessingStep[];
  currentStepIndex: number;
}

export const AIProcessingSteps: React.FC<AIProcessingStepsProps> = ({ steps, currentStepIndex }) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-2xs relative overflow-hidden animate-fade-in text-slate-900">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-200">
        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-slate-900">CivicFlow AI Autonomous Triage Pipeline</h3>
          <p className="text-xs text-slate-500">Processing natural language grievance, calculating priority, and routing to municipal officer</p>
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex || step.status === 'completed';
          const isCurrent = idx === currentStepIndex && step.status !== 'completed';
          const isPending = idx > currentStepIndex && step.status === 'pending';

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3.5 p-3 rounded-lg transition-all duration-200 border ${
                isDone
                  ? 'bg-white border-slate-200 text-slate-800 shadow-2xs'
                  : isCurrent
                  ? 'bg-blue-50/60 border-blue-200 text-blue-950'
                  : 'bg-slate-100/50 border-slate-200 text-slate-400'
              }`}
            >
              <div className="mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-400" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isCurrent ? 'text-blue-900' : isDone ? 'text-slate-800' : 'text-slate-500'}`}>
                    {step.label}
                  </span>
                  {isDone && step.result && (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {step.result}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
