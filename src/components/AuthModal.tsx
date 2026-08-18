import React, { useState } from 'react';
import { X, User, Shield, ArrowRight, Building2, CheckCircle2, Wrench, Trash2, Droplets, Zap } from 'lucide-react';
import { User as UserType, Role } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: UserType) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [role, setRole] = useState<'citizen' | 'admin'>('citizen');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const demoCitizens: UserType[] = [
    {
      id: 'usr-citizen-1',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      role: Role.CITIZEN,
      city_id: 'city-1',
      phone: '+91 98111 22334',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'usr-citizen-2',
      name: 'Pooja Verma',
      email: 'pooja.verma@example.com',
      role: Role.CITIZEN,
      city_id: 'city-1',
      phone: '+91 98222 33445',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const demoAdmins: UserType[] = [
    {
      id: 'usr-admin-roads',
      name: 'Er. Amit Kulkarni',
      email: 'admin.roads@delhi.gov.in',
      role: Role.DEPARTMENT_ADMIN,
      department_id: 'dept-3',
      department_name: 'Public Works & Roads Engineering Division',
      jurisdiction_name: 'Delhi Roads & Infrastructure Division',
      city_id: 'city-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'usr-admin-sanitation',
      name: 'Dr. Sunita Sharma',
      email: 'admin.sanitation@delhi.gov.in',
      role: Role.DEPARTMENT_ADMIN,
      department_id: 'dept-2',
      department_name: 'Solid Waste Management & Sanitation Dept',
      jurisdiction_name: 'Delhi Municipal Sanitation Services',
      city_id: 'city-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'usr-admin-water',
      name: 'Er. Rajesh Verma',
      email: 'admin.water@delhi.gov.in',
      role: Role.DEPARTMENT_ADMIN,
      department_id: 'dept-1',
      department_name: 'Municipal Water Supply & Sewerage Board',
      jurisdiction_name: 'Delhi Jal & Sewerage Board',
      city_id: 'city-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'usr-admin-elec',
      name: 'Er. Priya Nair',
      email: 'admin.electricity@delhi.gov.in',
      role: Role.DEPARTMENT_ADMIN,
      department_id: 'dept-4',
      department_name: 'Municipal Lighting & Electrical Services',
      jurisdiction_name: 'Zonal Electrical Grid Directorate',
      city_id: 'city-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'usr-admin-city',
      name: 'Dr. Rajesh Sharma',
      email: 'commissioner@delhi.gov.in',
      role: Role.CITY_ADMIN,
      department_name: 'General Secretariat',
      jurisdiction_name: 'Municipal Corporation General Secretariat',
      city_id: 'city-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    onLogin({
      id: `usr-${Date.now()}`,
      name,
      email,
      role: role === 'citizen' ? Role.CITIZEN : Role.DEPARTMENT_ADMIN,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in font-sans">
      <div
        id="auth-modal"
        className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 sm:p-8 shadow-xl text-slate-900 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Sign In to CivicFlow</h2>
            <p className="text-xs text-slate-500">Access citizen grievance tracking or department administrator tools</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="my-5 p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700">⚡ Instant Demo Profiles:</span>
            <span className="text-[10px] text-slate-400">Click to switch instantly</span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Citizen Residents</span>
            <div className="grid grid-cols-2 gap-2">
              {demoCitizens.map(c => (
                <button
                  key={c.id}
                  onClick={() => onLogin(c)}
                  className="p-2.5 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-left transition-colors shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-blue-700">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>{c.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{c.phone || 'Citizen Resident'}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Department Administrators</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {demoAdmins.map(a => (
                <button
                  key={a.id}
                  onClick={() => onLogin(a)}
                  className="p-2.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-400 text-left transition-colors shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Shield className="w-3.5 h-3.5 text-slate-700" />
                    <span>{a.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 truncate">{a.department_name || a.jurisdiction_name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Manual Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Custom Sign In</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('citizen')}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                  role === 'citizen'
                    ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Citizen Resident
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                  role === 'admin'
                    ? 'bg-slate-100 border-slate-400 text-slate-900 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Municipal Administrator
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 text-slate-900 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. ramesh.kumar@example.com"
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 text-slate-900 outline-none transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue to Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

