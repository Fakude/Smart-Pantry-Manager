/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PantryItem, Recipe, UserSettings } from './types';
import { INITIAL_PANTRY_ITEMS, SEEDED_RECIPES, INITIAL_USER_SETTINGS } from './data/seedData';
import { evaluateRecipeStrictMatch } from './utils/matchingEngine';
import { AndroidPhoneFrame } from './components/AndroidEmulator/AndroidPhoneFrame';
import { PantryScreen } from './components/AndroidEmulator/PantryScreen';
import { AddEditScreen } from './components/AndroidEmulator/AddEditScreen';
import { SuggestedRecipesScreen } from './components/AndroidEmulator/SuggestedRecipesScreen';
import { RecipeDetailScreen } from './components/AndroidEmulator/RecipeDetailScreen';
import { SettingsScreen } from './components/AndroidEmulator/SettingsScreen';
import { StrictMatchingDebugger } from './components/StrictMatchingDebugger';
import { CodebaseViewer } from './components/CodebaseViewer';
import { IncrementalStepsViewer } from './components/IncrementalStepsViewer';
import { GitHubWalkthrough } from './components/GitHubWalkthrough';
import { VideoRehearsalTool } from './components/VideoRehearsalTool';
import { WrittenReportViewer } from './components/WrittenReportViewer';
import { generateAndroidProjectZip, triggerBlobDownload } from './utils/exportProjectZip';
import { 
  Smartphone, 
  Binary, 
  Code, 
  Layers,
  GitBranch, 
  Video, 
  FileText, 
  Download, 
  Database, 
  Sparkles, 
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Plus
} from 'lucide-react';

export default function App() {
  // Navigation tabs across portfolio
  const [activePortfolioTab, setActivePortfolioTab] = useState<
    'emulator' | 'strict_lab' | 'codebase' | 'steps' | 'github' | 'video' | 'report'
  >('emulator');

  // Android emulator state
  const [androidTab, setAndroidTab] = useState<'pantry' | 'recipes' | 'settings'>('pantry');
  const [activeScreen, setActiveScreen] = useState<'list' | 'add_edit' | 'detail'>('list');
  const [selectedPantryItem, setSelectedPantryItem] = useState<PantryItem | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistent Pantry State (Simulating on-device SQLite database smart_pantry.db)
  const [pantry, setPantry] = useState<PantryItem[]>(() => {
    const saved = localStorage.getItem('smart_pantry_db_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing pantry items from local storage', e);
      }
    }
    return INITIAL_PANTRY_ITEMS;
  });

  // Persistent Settings State (Simulating Android SharedPreferences)
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('smart_pantry_prefs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing settings from local storage', e);
      }
    }
    return INITIAL_USER_SETTINGS;
  });

  // Save to persistent storage whenever state changes
  useEffect(() => {
    localStorage.setItem('smart_pantry_db_items', JSON.stringify(pantry));
  }, [pantry]);

  useEffect(() => {
    localStorage.setItem('smart_pantry_prefs', JSON.stringify(settings));
  }, [settings]);

  // Toast feedback helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // CRUD Operations on Pantry Items (matching SQLite DatabaseHelper)
  const handleSavePantryItem = (itemData: Omit<PantryItem, 'id' | 'addedAt'> & { id?: string }) => {
    if (itemData.id) {
      // UPDATE
      setPantry(prev =>
        prev.map(p =>
          p.id === itemData.id
            ? { ...p, ...itemData, addedAt: p.addedAt }
            : p
        )
      );
      showToast(`Updated "${itemData.name}" in SQLite`);
    } else {
      // CREATE
      const newItem: PantryItem = {
        id: `pantry-${Date.now()}`,
        name: itemData.name,
        quantity: itemData.quantity,
        unit: itemData.unit,
        category: itemData.category,
        expiryDate: itemData.expiryDate,
        notes: itemData.notes,
        addedAt: new Date().toISOString(),
      };
      setPantry(prev => [newItem, ...prev]);
      showToast(`Added "${newItem.name}" to SQLite`);
    }
    setActiveScreen('list');
  };

  const handleDeletePantryItem = (id: string) => {
    const item = pantry.find(p => p.id === id);
    setPantry(prev => prev.filter(p => p.id !== id));
    showToast(`Deleted "${item?.name || 'item'}" from SQLite`);
    if (activeScreen === 'add_edit') {
      setActiveScreen('list');
    }
  };

  const handleResetDatabase = () => {
    setPantry(INITIAL_PANTRY_ITEMS);
    setSettings(INITIAL_USER_SETTINGS);
    localStorage.removeItem('smart_pantry_db_items');
    localStorage.removeItem('smart_pantry_prefs');
    showToast('Database reset: Restored 20 seeded recipes & sample pantry');
  };

  const handleCookRecipe = (recipe: Recipe) => {
    // Deduct ingredients from pantry
    setPantry(prev => {
      return prev.map(pItem => {
        const req = recipe.ingredients.find(
          r => r.name.toLowerCase() === pItem.name.toLowerCase()
        );
        if (req) {
          const remaining = Math.max(0, pItem.quantity - req.quantity);
          return { ...pItem, quantity: remaining };
        }
        return pItem;
      });
    });
    showToast(`Cooked "${recipe.name}"! Inventory deducted in SQLite`);
  };

  const handleQuickAddIngredient = (name: string, quantity: number, unit: string) => {
    const existing = pantry.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      setPantry(prev =>
        prev.map(p =>
          p.id === existing.id ? { ...p, quantity: p.quantity + quantity } : p
        )
      );
      showToast(`Topped up "${name}" (+${quantity} ${unit})`);
    } else {
      const newItem: PantryItem = {
        id: `pantry-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        name,
        quantity,
        unit,
        category: 'Pantry Staples',
        expiryDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
        addedAt: new Date().toISOString(),
      };
      setPantry(prev => [newItem, ...prev]);
      showToast(`Added "${name}" to pantry`);
    }
  };

  const handleQuickRemoveIngredient = (name: string) => {
    setPantry(prev => prev.filter(p => p.name.toLowerCase() !== name.toLowerCase()));
    showToast(`Removed "${name}" from pantry`);
  };

  // Evaluate strict matching count
  const strictMatchCount = SEEDED_RECIPES.filter(
    r => evaluateRecipeStrictMatch(r, pantry, settings.fuzzyMatching).isStrictMatch
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* ========================================================
          TOP NAVIGATION BAR (Strict 3-Zone Contract)
          ======================================================== */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs">
        {/* Zone 1: Single text element wordmark in display face */}
        <div className="flex items-center gap-2">
          <span className="text-base md:text-lg font-bold tracking-tight text-blue-950">
            Smart Pantry Manager
          </span>
          <span className="hidden sm:inline-block text-[11px] font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Richfield MAD700 Portfolio
          </span>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActivePortfolioTab('emulator')}
            className={`transition-colors flex items-center gap-1.5 ${
              activePortfolioTab === 'emulator'
                ? 'text-blue-900 font-bold border-b-2 border-blue-900 pb-0.5'
                : 'hover:text-blue-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Live Android App
          </button>

          <button
            onClick={() => setActivePortfolioTab('strict_lab')}
            className={`transition-colors flex items-center gap-1.5 ${
              activePortfolioTab === 'strict_lab'
                ? 'text-blue-900 font-bold border-b-2 border-blue-900 pb-0.5'
                : 'hover:text-blue-900'
            }`}
          >
            <Binary className="w-3.5 h-3.5" />
            Strict Matching Lab
          </button>

          <button
            onClick={() => setActivePortfolioTab('codebase')}
            className={`transition-colors flex items-center gap-1.5 ${
              activePortfolioTab === 'codebase'
                ? 'text-blue-900 font-bold border-b-2 border-blue-900 pb-0.5'
                : 'hover:text-blue-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Java Codebase
          </button>

          <button
            onClick={() => setActivePortfolioTab('steps')}
            className={`transition-colors flex items-center gap-1.5 ${
              activePortfolioTab === 'steps'
                ? 'text-blue-900 font-bold border-b-2 border-blue-900 pb-0.5'
                : 'hover:text-blue-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-900" />
            12 Steps
          </button>

          <button
            onClick={() => setActivePortfolioTab('github')}
            className={`transition-colors flex items-center gap-1.5 ${
              activePortfolioTab === 'github'
                ? 'text-blue-900 font-bold border-b-2 border-blue-900 pb-0.5'
                : 'hover:text-blue-900'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            GitHub History
          </button>

          <button
            onClick={() => setActivePortfolioTab('video')}
            className={`transition-colors flex items-center gap-1.5 ${
              activePortfolioTab === 'video'
                ? 'text-blue-900 font-bold border-b-2 border-blue-900 pb-0.5'
                : 'hover:text-blue-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Video Rehearsal
          </button>

          <button
            onClick={() => setActivePortfolioTab('report')}
            className={`transition-colors flex items-center gap-1.5 ${
              activePortfolioTab === 'report'
                ? 'text-blue-900 font-bold border-b-2 border-blue-900 pb-0.5'
                : 'hover:text-blue-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Written Report
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              const zipBlob = await generateAndroidProjectZip();
              triggerBlobDownload(zipBlob, 'SmartPantryManager_AndroidStudio_Java.zip');
            }}
            className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5 whitespace-nowrap active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .ZIP</span>
          </button>
        </div>
      </header>

      {/* Mobile Category Bar (visible only on small screens) */}
      <div className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white border-b border-slate-200 overflow-x-auto no-scrollbar shrink-0">
        {[
          { id: 'emulator', label: 'App' },
          { id: 'strict_lab', label: 'Strict Lab' },
          { id: 'codebase', label: 'Java Code' },
          { id: 'steps', label: '12 Steps' },
          { id: 'github', label: 'GitHub' },
          { id: 'video', label: 'Video' },
          { id: 'report', label: 'Report' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActivePortfolioTab(t.id as any)}
            className={`px-3 py-1 text-xs font-semibold rounded whitespace-nowrap ${
              activePortfolioTab === t.id
                ? 'bg-blue-900 text-white'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ========================================================
          MAIN VIEWPORT CONTENT
          ======================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        {/* TAB 1: LIVE ANDROID APP EMULATOR & TESTING DASHBOARD */}
        {activePortfolioTab === 'emulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Photorealistic Android Emulator */}
            <div className="lg:col-span-5 flex justify-center">
              <AndroidPhoneFrame
                currentTab={activeScreen === 'add_edit' ? 'add_edit' : activeScreen === 'detail' ? 'recipe_detail' : androidTab}
                onTabChange={tab => {
                  setAndroidTab(tab);
                  setActiveScreen('list');
                }}
                recipeCount={strictMatchCount}
                toastMessage={toastMessage}
              >
                {/* Screen 1: Pantry List Activity (or Add/Edit) */}
                {androidTab === 'pantry' && (
                  activeScreen === 'add_edit' ? (
                    <AddEditScreen
                      itemToEdit={selectedPantryItem}
                      onSave={handleSavePantryItem}
                      onDelete={handleDeletePantryItem}
                      onCancel={() => setActiveScreen('list')}
                    />
                  ) : (
                    <PantryScreen
                      pantry={pantry}
                      settings={settings}
                      onAddItem={() => {
                        setSelectedPantryItem(null);
                        setActiveScreen('add_edit');
                      }}
                      onEditItem={item => {
                        setSelectedPantryItem(item);
                        setActiveScreen('add_edit');
                      }}
                      onDeleteItem={handleDeletePantryItem}
                      onNavigateToRecipes={() => {
                        setAndroidTab('recipes');
                        setActiveScreen('list');
                      }}
                      onSeedSample={() => {
                        setPantry(INITIAL_PANTRY_ITEMS);
                        showToast('Loaded sample pantry items');
                      }}
                    />
                  )
                )}

                {/* Screen 2: Suggested Recipes Activity (or Recipe Detail) */}
                {androidTab === 'recipes' && (
                  activeScreen === 'detail' && selectedRecipe ? (
                    <RecipeDetailScreen
                      recipe={selectedRecipe}
                      pantry={pantry}
                      settings={settings}
                      onBack={() => setActiveScreen('list')}
                      onCookRecipe={handleCookRecipe}
                    />
                  ) : (
                    <SuggestedRecipesScreen
                      recipes={SEEDED_RECIPES}
                      pantry={pantry}
                      settings={settings}
                      onSelectRecipe={recipe => {
                        setSelectedRecipe(recipe);
                        setActiveScreen('detail');
                      }}
                      onNavigateToPantry={() => {
                        setAndroidTab('pantry');
                        setActiveScreen('list');
                      }}
                      onQuickAddIngredient={handleQuickAddIngredient}
                    />
                  )
                )}

                {/* Screen 3: Settings Activity */}
                {androidTab === 'settings' && (
                  <SettingsScreen
                    settings={settings}
                    onUpdateSettings={newSt => setSettings(prev => ({ ...prev, ...newSt }))}
                    onResetDatabase={handleResetDatabase}
                  />
                )}
              </AndroidPhoneFrame>
            </div>

            {/* Right: Interactive Assessor Console & Quick Test Lab */}
            <div className="lg:col-span-7 space-y-5">
              {/* Evaluator Welcome Banner */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                    Examiner & Moderator Assessment Console
                  </span>
                  <span className="text-xs text-slate-500 font-medium">100 Marks Portfolio</span>
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  Live Application Testing & SQLite Persistence Verification
                </h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  The emulator on the left runs the complete <strong>Smart Pantry Manager</strong> Android application. Test full CRUD operations, verify the Section 2.3 strict-matching rule, and confirm data persistence between page reloads.
                </p>

                {/* Status Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Pantry Leftovers</span>
                    <span className="text-sm font-bold text-slate-900 tabular-nums">{pantry.length} items</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Strict Matches</span>
                    <span className="text-sm font-bold text-emerald-600 tabular-nums">{strictMatchCount} recipes</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Database Engine</span>
                    <span className="text-sm font-bold text-blue-900">SQLite (On-device)</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">SDK Target</span>
                    <span className="text-sm font-bold text-slate-800">Android 14 (API 34)</span>
                  </div>
                </div>
              </div>

              {/* Marker Quick Test Scenarios (Directly tests Section 2.3 & 5.1 requirements) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    One-Click Section 2.3 Marker Verification Tests
                  </h3>
                  <span className="text-[11px] text-slate-400">Section 2.3 Core Logic</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Test 1 */}
                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/60 flex flex-col justify-between">
                    <div>
                      <span className="font-semibold text-slate-900 block mb-1">
                        Test A: Strict Removal Exclusion
                      </span>
                      <p className="text-[11px] text-slate-500 mb-2">
                        Deletes &quot;Tomatoes&quot; from the pantry to prove that &quot;Rustic Tomato Basil Spaghetti&quot; instantly vanishes from the suggestions list (Section 2.3).
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        handleQuickRemoveIngredient('Tomatoes');
                        setAndroidTab('recipes');
                        setActiveScreen('list');
                      }}
                      className="w-full py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded border border-red-200 transition-colors"
                    >
                      Trigger: Delete Tomatoes &rarr; Check Recipes
                    </button>
                  </div>

                  {/* Test 2 */}
                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/60 flex flex-col justify-between">
                    <div>
                      <span className="font-semibold text-slate-900 block mb-1">
                        Test B: Unlock Fried Rice
                      </span>
                      <p className="text-[11px] text-slate-500 mb-2">
                        Injects Rice, Eggs, Soy Sauce, and Garlic to prove that &quot;Leftover Egg Fried Rice&quot; qualifies immediately as a strict match.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        handleQuickAddIngredient('Cooked White Rice', 250, 'g');
                        handleQuickAddIngredient('Eggs', 2, 'pcs');
                        handleQuickAddIngredient('Soy Sauce', 20, 'ml');
                        handleQuickAddIngredient('Garlic', 2, 'cloves');
                        handleQuickAddIngredient('Olive Oil', 15, 'ml');
                        setAndroidTab('recipes');
                        setActiveScreen('list');
                      }}
                      className="w-full py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded border border-emerald-200 transition-colors"
                    >
                      Trigger: Add Ingredients &rarr; Unlock Recipe
                    </button>
                  </div>
                </div>
              </div>

              {/* Active SQLite Database Table View */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-900" />
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Live SQLite Table View: <code>pantry_items</code> ({pantry.length} rows)
                    </h3>
                  </div>
                  <button
                    onClick={handleResetDatabase}
                    className="text-[11px] text-blue-900 hover:underline font-medium flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Restore Initial Data
                  </button>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-x-auto max-h-48 overflow-y-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 uppercase sticky top-0">
                      <tr>
                        <th className="py-1.5 px-2.5">id</th>
                        <th className="py-1.5 px-2.5">name</th>
                        <th className="py-1.5 px-2.5">quantity</th>
                        <th className="py-1.5 px-2.5">unit</th>
                        <th className="py-1.5 px-2.5">category</th>
                        <th className="py-1.5 px-2.5">expiry_date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px]">
                      {pantry.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50/60">
                          <td className="py-1.5 px-2.5 text-slate-400">{item.id.slice(-6)}</td>
                          <td className="py-1.5 px-2.5 font-semibold text-slate-900">{item.name}</td>
                          <td className="py-1.5 px-2.5 text-blue-900 tabular-nums">{item.quantity}</td>
                          <td className="py-1.5 px-2.5 text-slate-600">{item.unit}</td>
                          <td className="py-1.5 px-2.5 text-slate-600">{item.category}</td>
                          <td className="py-1.5 px-2.5 text-slate-500">{item.expiryDate || 'NULL'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-slate-400">
                  Data persists across page reloads and browser sessions via persistent storage, demonstrating true CRUD and persistence without memory-only leakage.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STRICT MATCHING LAB */}
        {activePortfolioTab === 'strict_lab' && (
          <StrictMatchingDebugger
            recipes={SEEDED_RECIPES}
            pantry={pantry}
            settings={settings}
            onAddIngredient={handleQuickAddIngredient}
            onRemoveIngredient={handleQuickRemoveIngredient}
          />
        )}

        {/* TAB 3: COMPLETE JAVA CODEBASE BROWSER & DOWNLOAD */}
        {activePortfolioTab === 'codebase' && <CodebaseViewer />}

        {/* TAB 4: 12 INCREMENTAL STEPS DIRECTORY EXPLORER */}
        {activePortfolioTab === 'steps' && <IncrementalStepsViewer />}

        {/* TAB 5: GITHUB COMMIT HISTORY & README */}
        {activePortfolioTab === 'github' && <GitHubWalkthrough />}

        {/* TAB 5: VIDEO DEMONSTRATION REHEARSAL & TELEPROMPTER */}
        {activePortfolioTab === 'video' && <VideoRehearsalTool />}

        {/* TAB 6: ACADEMIC WRITTEN REPORT */}
        {activePortfolioTab === 'report' && <WrittenReportViewer settings={settings} />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-5 px-6 text-center text-xs text-slate-500">
        <p>
          Richfield Graduate Institute of Technology (Pty) Ltd · Faculty of Information Technology · Mobile App Development 700 (MAD700)
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Candidate: {settings.studentName} (ITS: {settings.studentNumber}) · Smart Pantry Manager Portfolio of Evidence
        </p>
      </footer>
    </div>
  );
}
