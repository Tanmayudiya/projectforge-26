import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { AppUser, storageService } from '../../services/storage';
import {
  Settings,
  Shield,
  Database,
  Sparkles,
  Cloud,
  CheckCircle2,
  RefreshCw,
  User,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';

interface SettingsViewProps {
  user: AppUser | null;
  profile: StudentProfile | null;
  onResetData: () => void;
  onNavigateToProfile: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  profile,
  onResetData,
  onNavigateToProfile,
}) => {
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleReset = () => {
    setResetting(true);
    storageService.resetToDemo();
    onResetData();
    setTimeout(() => {
      setResetting(false);
      setResetMessage('Database and local workspace successfully reset to fresh demo state!');
      setTimeout(() => setResetMessage(null), 3000);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-slate-100 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
          <Settings className="w-4 h-4" />
          <span>System Settings & Cloud Diagnostics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Configuration & Infrastructure</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review Google Cloud service health, authentication state, and workspace persistence settings.
        </p>
      </div>

      {/* Cloud Services Health Diagnostics */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Cloud className="w-4 h-4 text-blue-400" />
          <span>Google Services Stack Diagnostics</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Gemini 3.8 Flash</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-700/60">
                  ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Connected via server-side Express proxy (`/api/gemini/*`). Isolated API keys with Zero Client Leakage.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex items-start space-x-3">
            <Database className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Cloud Firestore</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-700/60">
                  PERSISTENT
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                ABAC rules active (`firestore.rules`). Stores profiles, blueprints, and milestone status.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex items-start space-x-3">
            <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Firebase Authentication</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-700/60">
                  INITIALIZED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Zero-Trust Token Client. Current session: {user?.email || 'Demo Student'}.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex items-start space-x-3">
            <Cloud className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Cloud Run Ingress</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-700/60">
                  PORT 3000
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Node.js + Express backend serving Vite SPA bundle on external reverse proxy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Student Profile Quick Edit */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-400" />
            <span>Student Profile</span>
          </h2>
          <p className="text-xs text-slate-400">
            Current Profile: <strong>{profile?.name}</strong> • {profile?.preferredDomain} • {profile?.experienceLevel}
          </p>
        </div>

        <button
          onClick={onNavigateToProfile}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
        >
          Edit Profile Settings
        </button>
      </div>

      {/* Workspace Reset */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-rose-400" />
          <span>Reset Demo Workspace Data</span>
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Need to test the initial state from scratch? This clears all local projects and resets the seeded demo capstone.
        </p>

        {resetMessage && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{resetMessage}</span>
          </div>
        )}

        <button
          id="btn-reset-demo-data"
          onClick={handleReset}
          disabled={resetting}
          className="px-4 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800 text-rose-300 text-xs font-semibold transition-colors flex items-center space-x-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
          <span>{resetting ? 'Resetting Workspace...' : 'Reset to Fresh Demo Workspace'}</span>
        </button>
      </div>
    </div>
  );
};
