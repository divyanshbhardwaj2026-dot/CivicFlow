import React from 'react';
import { Building2, Shield, User, ArrowLeftRight, Sparkles, LogOut, Radio, Phone, Clock, Globe } from 'lucide-react';
import { PortalType, User as UserType } from '../types';

interface NavbarProps {
  currentPortal: PortalType;
  currentUser: UserType | null;
  onSwitchPortal: (portal: PortalType) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onSimulate: () => void;
  isSimulating?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPortal,
  currentUser,
  onSwitchPortal,
  onOpenAuth,
  onLogout,
  onSimulate,
  isSimulating,
}) => {
  const isAdmin = currentPortal === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Utility Bar (Dignified Civic Dark Header from reference) */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 sm:px-8 py-1.5 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3 h-3 text-slate-400" />
              <span className="hidden sm:inline font-medium">Toll-Free Civic Helpline:</span>
              <span className="font-semibold text-white">1800 11 0033</span>
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>Intelligent Redressal: 24x7 Automated Triage</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Engine Active</span>
            </div>

            <button
              onClick={() => onSwitchPortal(isAdmin ? 'citizen' : 'admin')}
              className="text-slate-300 hover:text-white font-medium flex items-center gap-1 transition-colors px-2 py-0.5 rounded hover:bg-slate-800"
            >
              <ArrowLeftRight className="w-3 h-3 text-blue-400" />
              <span>{isAdmin ? 'Switch to Citizen View' : 'Switch to Admin Portal'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand & Emblem */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onSwitchPortal(null)}
          title="Return to Gateway"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-900 transition-colors">
            {isAdmin ? <Shield className="w-5 h-5 text-emerald-400" /> : <Building2 className="w-5 h-5 text-blue-400" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-blue-900 transition-colors">
                CivicFlow <span className="font-light text-slate-500">AI</span>
              </span>
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                  isAdmin
                    ? 'bg-slate-100 text-slate-800 border-slate-300'
                    : 'bg-blue-50 text-blue-800 border-blue-200'
                }`}
              >
                {isAdmin ? 'Administrator Command' : 'Citizen Grievance Portal'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              National Autonomous Grievance Triage &amp; Multi-City Dispatch Platform
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Demo Simulator CTA */}
          <button
            id="btn-simulate-navbar"
            onClick={onSimulate}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors shadow-2xs disabled:opacity-50"
            title="Simulate a live citizen complaint for evaluation"
          >
            <Sparkles className={`w-3.5 h-3.5 text-amber-700 ${isSimulating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isSimulating ? 'Processing...' : 'Simulate Complaint'}</span>
            <span className="sm:hidden">Simulate</span>
          </button>

          {/* User Auth or Profile Button */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:block text-left text-xs">
                <div className="font-semibold text-slate-900 truncate max-w-[120px]">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500 capitalize">{currentUser.role}</div>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="btn-open-auth"
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-2xs transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>Officer / Citizen Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
