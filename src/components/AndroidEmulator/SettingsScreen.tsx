import React from 'react';
import { UserSettings } from '../../types';
import { Settings as SettingsIcon, Bell, Database, User, ShieldCheck, RotateCcw } from 'lucide-react';

interface SettingsScreenProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onResetDatabase: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onResetDatabase,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Top App Bar */}
      <div className="bg-blue-900 text-white px-4 py-3 shadow-md shrink-0">
        <h1 className="text-base font-semibold">Settings & Preferences</h1>
        <p className="text-[10px] text-blue-200">SharedPreferences Configuration</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Student & Course Details */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <User className="w-4 h-4 text-blue-900" />
            <span>Student & Assessment Profile</span>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Student Full Name
            </label>
            <input
              type="text"
              value={settings.studentName}
              onChange={e => onUpdateSettings({ studentName: e.target.value })}
              className="w-full px-3 py-1.5 text-xs text-slate-900 bg-white border border-slate-300 rounded outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Student ITS No.
              </label>
              <input
                type="text"
                value={settings.studentNumber}
                onChange={e => onUpdateSettings({ studentNumber: e.target.value })}
                className="w-full px-3 py-1.5 text-xs text-slate-900 bg-white border border-slate-300 rounded outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Module Code
              </label>
              <input
                type="text"
                value={settings.moduleCode}
                disabled
                className="w-full px-3 py-1.5 text-xs text-slate-500 bg-slate-100 border border-slate-200 rounded cursor-not-allowed"
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-500 pt-1">
            Institution: <strong>{settings.institution}</strong>
          </div>
        </div>

        {/* Expiring Soon Alerts (Section 2.2 Requirement) */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <Bell className="w-4 h-4 text-amber-600" />
            <span>Waste Prevention Alerts</span>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-700 font-medium">Expiring Soon Threshold:</span>
              <span className="font-bold text-blue-900 px-2 py-0.5 bg-blue-50 rounded tabular-nums">
                {settings.expiringSoonDays} Days
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="14"
              value={settings.expiringSoonDays}
              onChange={e => onUpdateSettings({ expiringSoonDays: parseInt(e.target.value, 10) })}
              className="w-full accent-blue-900 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Highlights items in amber/red when expiry date is within this timeframe.
            </p>
          </div>
        </div>

        {/* Matching Tolerances (Section 2.3) */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Strict Matching Engine Settings</span>
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.fuzzyMatching}
              onChange={e => onUpdateSettings({ fuzzyMatching: e.target.checked })}
              className="mt-0.5 w-4 h-4 accent-blue-900 cursor-pointer"
            />
            <div>
              <span className="text-xs font-semibold text-slate-800 block">
                Enable Singular/Plural Normalization
              </span>
              <span className="text-[11px] text-slate-500 leading-tight block">
                Prevents false negative rejects when comparing &quot;tomatoes&quot; vs &quot;tomato&quot; or &quot;potatoes&quot; vs &quot;potato&quot; as mandated in Section 2.3.
              </span>
            </div>
          </label>
        </div>

        {/* Database Persistence Maintenance */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <Database className="w-4 h-4 text-indigo-600" />
            <span>Database Storage (SQLite Simulation)</span>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed">
            Data is currently persisted in persistent browser storage representing the on-device SQLite database file (<strong>smart_pantry.db</strong>).
          </p>

          <button
            onClick={onResetDatabase}
            className="w-full py-2 px-3 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Database & Re-seed 20 Default Recipes
          </button>
        </div>
      </div>
    </div>
  );
};
