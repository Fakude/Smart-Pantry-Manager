import React from 'react';
import { Wifi, Battery, Signal, UtensilsCrossed, BookOpen, Settings } from 'lucide-react';

interface AndroidPhoneFrameProps {
  currentTab: 'pantry' | 'recipes' | 'settings' | 'add_edit' | 'recipe_detail';
  onTabChange: (tab: 'pantry' | 'recipes' | 'settings') => void;
  recipeCount: number;
  children: React.ReactNode;
  toastMessage?: string | null;
}

export const AndroidPhoneFrame: React.FC<AndroidPhoneFrameProps> = ({
  currentTab,
  onTabChange,
  recipeCount,
  children,
  toastMessage,
}) => {
  return (
    <div className="relative mx-auto w-full max-w-[380px] h-[720px] bg-slate-900 rounded-[44px] p-3 shadow-2xl ring-1 ring-slate-800/80 flex flex-col select-none">
      {/* Outer Phone Shell Speaker & Camera Punch-hole */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center pointer-events-none">
        <div className="w-3.5 h-3.5 rounded-full bg-slate-950 ring-2 ring-slate-800/80 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-blue-900/60" />
        </div>
      </div>

      {/* Screen Inner Display */}
      <div className="relative w-full h-full bg-slate-50 rounded-[34px] overflow-hidden flex flex-col shadow-inner">
        {/* Android Status Bar */}
        <div className="bg-blue-900 text-white px-5 pt-2 pb-1.5 flex items-center justify-between text-[11px] font-medium tracking-tight shrink-0 select-none z-40">
          <span>10:05</span>
          <div className="flex items-center gap-1.5 opacity-90">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {children}

          {/* Android Toast Notification */}
          {toastMessage && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs px-4 py-2 rounded-full shadow-lg backdrop-blur-xs pointer-events-none animate-in fade-in zoom-in-95 duration-200 text-center max-w-[85%] whitespace-nowrap">
              {toastMessage}
            </div>
          )}
        </div>

        {/* Android Material Bottom Navigation Bar */}
        <div className="bg-white border-t border-slate-200/90 px-3 py-1.5 grid grid-cols-3 items-center shrink-0 z-40">
          {/* Pantry Tab */}
          <button
            onClick={() => onTabChange('pantry')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              currentTab === 'pantry' || currentTab === 'add_edit'
                ? 'text-blue-900 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Pantry</span>
          </button>

          {/* Recipes Tab */}
          <button
            onClick={() => onTabChange('recipes')}
            className={`relative flex flex-col items-center justify-center py-1 transition-colors ${
              currentTab === 'recipes' || currentTab === 'recipe_detail'
                ? 'text-blue-900 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <BookOpen className="w-4 h-4 mb-0.5" />
              {recipeCount > 0 && (
                <span className="absolute -top-1 -right-2 px-1 text-[9px] font-bold bg-emerald-600 text-white rounded-full leading-none py-0.5 tabular-nums">
                  {recipeCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight">Recipes</span>
          </button>

          {/* Settings Tab */}
          <button
            onClick={() => onTabChange('settings')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              currentTab === 'settings'
                ? 'text-blue-900 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">Settings</span>
          </button>
        </div>

        {/* Android Bottom Home Gesture Pill */}
        <div className="bg-white pb-2 flex justify-center shrink-0">
          <div className="w-24 h-1 bg-slate-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};
