import React from 'react';
import { User, Shield, ArrowRight, Sparkles, Building2, CheckCircle2, Phone, Clock, FileText, Activity, MapPin, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { PortalType } from '../types';

interface RoleSelectionGatewayProps {
  onSelectPortal: (portal: PortalType) => void;
  onOpenStaticPage: (page: string) => void;
}

export const RoleSelectionGateway: React.FC<RoleSelectionGatewayProps> = ({ onSelectPortal, onOpenStaticPage }) => {
  return (
    <div id="role-selection-gateway" className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Official Top Utility Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 sm:px-8 py-2 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3 h-3 text-slate-400" />
              <span className="font-medium">National Civic Helpline:</span>
              <span className="font-bold text-white">1800 11 0033</span>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>Smart Cities Mission • 24x7 Intelligent Triage</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Gemini 3.7 Flash Active
            </span>
          </div>
        </div>
      </div>

      {/* Main Header / Navigation Bar */}
      <header className="bg-white border-b border-slate-200 shadow-2xs px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-slate-900">CivicFlow AI</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
                  National Smart Governance
                </span>
              </div>
              <p className="text-xs text-slate-500">Autonomous Multilingual Grievance Redressal &amp; Incident Dispatch</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs font-semibold text-slate-600">
            <span className="text-slate-500">ISO 9001:2015 Compliant</span>
          </div>
        </div>
      </header>

      {/* Hero & Editorial Greeting Section (Inspired by reference images) */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
        {/* Editorial Eyebrow & Headline */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Serving Citizens with Transparency, Intelligence, and Trust</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Integrated Civic Grievance &amp; Autonomous Dispatch Portal
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Select your portal to continue. Citizens can file grievances in any language with automated department routing; municipal authorities can monitor real-time incident clusters and citywide dispatch.
          </p>
        </div>

        {/* Two Primary Portal Selection Cards (Clean, Structured, Professional) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
          {/* CITIZEN PORTAL CARD */}
          <div
            id="portal-citizen-card"
            onClick={() => onSelectPortal('citizen')}
            className="group bg-white border border-slate-200 hover:border-blue-600 rounded-xl p-8 text-left transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <User className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-50 text-blue-800 border border-blue-200">
                  Citizen &amp; Resident
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                Report a Civic Grievance
              </h2>

              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Submit complaints in Hindi, English, or regional languages. AI classifies the urgency, notifies the responsible department, and gives you a live tracking dossier.
              </p>

              <div className="mt-6 space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Multilingual Natural Language Intake (Hindi/English)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Real-time Status Tracking &amp; Officer Contact</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Citizen Resolution Rating &amp; Feedback Dossier</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-bold text-blue-700 group-hover:underline">
                Enter Citizen Redressal Portal
              </span>
              <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all group-hover:translate-x-1">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* ADMINISTRATOR PORTAL CARD */}
          <div
            id="portal-admin-card"
            onClick={() => onSelectPortal('admin')}
            className="group bg-white border border-slate-200 hover:border-slate-900 rounded-xl p-8 text-left transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <Shield className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-300">
                  Municipal Command
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 group-hover:text-slate-900 transition-colors">
                Municipal Operations Command
              </h2>

              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Centralized command console for municipal commissioners and ward officers. Monitor live intake feeds, analyze category density, and dispatch emergency response crews to incident clusters.
              </p>

              <div className="mt-6 space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Multi-City Live Triage &amp; SLA Tracking Feed</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Spatial Hotspot &amp; Acute Incident Clustering</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Autonomous Department Routing &amp; Workload Health</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 group-hover:underline">
                Enter Administrator Console
              </span>
              <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-800 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center transition-all group-hover:translate-x-1">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Official Civic Stats Banner (From reference image) */}
        <div className="mt-12 max-w-4xl mx-auto w-full bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="pt-2 md:pt-0">
              <div className="text-2xl font-black text-slate-900">1,842+</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Grievances Handled</div>
            </div>
            <div className="pt-2 md:pt-0 md:pl-4">
              <div className="text-2xl font-black text-blue-700">96.4%</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">AI Triage Accuracy</div>
            </div>
            <div className="pt-2 md:pt-0 md:pl-4">
              <div className="text-2xl font-black text-emerald-700">18.5h</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Avg Resolution Time</div>
            </div>
            <div className="pt-2 md:pt-0 md:pl-4">
              <div className="text-2xl font-black text-slate-900">5 Cities</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Connected Municipalities</div>
            </div>
          </div>
        </div>
      </main>

      {/* Official Government Footer (From reference image) */}
      <footer className="bg-slate-900 text-slate-400 text-xs px-6 py-6 border-t border-slate-800 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-white">CivicFlow AI</span> • Ministry of Housing and Urban Affairs Smart Governance Initiative
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span className="cursor-pointer hover:text-slate-300" onClick={() => onOpenStaticPage('Privacy Policy')}>Privacy Policy</span>
            <span className="cursor-pointer hover:text-slate-300" onClick={() => onOpenStaticPage('Terms of Service')}>Terms of Service</span>
            <span className="cursor-pointer hover:text-slate-300" onClick={() => onOpenStaticPage('Accessibility')}>Accessibility</span>
            <span className="cursor-pointer hover:text-slate-300" onClick={() => onOpenStaticPage('Help Desk')}>Help Desk</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
