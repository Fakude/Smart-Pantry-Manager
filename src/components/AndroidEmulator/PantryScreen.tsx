import React, { useState } from 'react';
import { PantryItem, UserSettings } from '../../types';
import { Plus, Search, Calendar, Trash2, Edit2, AlertCircle, Sparkles } from 'lucide-react';

interface PantryScreenProps {
  pantry: PantryItem[];
  settings: UserSettings;
  onAddItem: () => void;
  onEditItem: (item: PantryItem) => void;
  onDeleteItem: (id: string) => void;
  onNavigateToRecipes: () => void;
  onSeedSample: () => void;
}

export const PantryScreen: React.FC<PantryScreenProps> = ({
  pantry,
  settings,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onNavigateToRecipes,
  onSeedSample,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isSearching, setIsSearching] = useState(false);

  const categories = ['All', 'Produce', 'Dairy & Eggs', 'Pantry Staples', 'Meat & Seafood', 'Bakery', 'Condiments & Spices'];

  // Check expiry urgency
  const getExpiryStatus = (dateStr?: string) => {
    if (!dateStr) return { text: 'No expiry', level: 'normal', days: null };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exp = new Date(dateStr);
    exp.setHours(0, 0, 0, 0);
    const diffDays = Math.round((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Expired', level: 'danger', days: diffDays };
    if (diffDays === 0) return { text: 'Expires today', level: 'danger', days: 0 };
    if (diffDays <= settings.expiringSoonDays) return { text: `Expires in ${diffDays}d`, level: 'warning', days: diffDays };
    return { text: `Exp: ${dateStr}`, level: 'normal', days: diffDays };
  };

  const filteredPantry = pantry.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const expiringSoonCount = pantry.filter(i => {
    const st = getExpiryStatus(i.expiryDate);
    return st.level === 'warning' || st.level === 'danger';
  }).length;

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Android Top App Bar */}
      <div className="bg-blue-900 text-white px-4 py-3 shadow-md shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold tracking-wide">Smart Pantry</h1>
            <p className="text-[11px] text-blue-200">On-Device Leftover Inventory</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsSearching(!isSearching)}
              className="p-2 rounded-full hover:bg-blue-800 transition-colors text-blue-100"
              title="Search pantry"
              aria-label="Search ingredients"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateToRecipes}
              className="px-2.5 py-1 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded shadow-sm transition-colors whitespace-nowrap"
            >
              Check Recipes
            </button>
          </div>
        </div>

        {/* Search Bar Input */}
        {isSearching && (
          <div className="mt-2.5">
            <input
              type="text"
              placeholder="Search ingredient (e.g. eggs, tomatoes)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 text-xs text-slate-900 bg-white rounded shadow-inner outline-none focus:ring-2 focus:ring-blue-400"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* Category Filter Horizontal Carousel */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-white border-b border-slate-200 overflow-x-auto no-scrollbar shrink-0">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 text-[11px] font-medium rounded whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-blue-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Expiry Urgency Alert Banner */}
      {expiringSoonCount > 0 && (
        <div className="mx-3 mt-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs text-amber-900 shrink-0">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>{expiringSoonCount} item{expiringSoonCount > 1 ? 's' : ''}</strong> expiring soon (within {settings.expiringSoonDays} days)!
            </span>
          </div>
          <button
            onClick={onNavigateToRecipes}
            className="text-[11px] text-amber-800 underline font-medium hover:text-amber-950 whitespace-nowrap ml-2"
          >
            Cook them now &rarr;
          </button>
        </div>
      )}

      {/* Pantry Items List (Simulated RecyclerView) */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {filteredPantry.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">
              {pantry.length === 0 ? 'Your Pantry is Empty' : 'No Matching Ingredients'}
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mb-4">
              {pantry.length === 0
                ? 'Add the ingredients you currently have at home to see strictly matched recipes.'
                : 'Try adjusting your search query or category filter.'}
            </p>
            {pantry.length === 0 && (
              <div className="flex gap-2">
                <button
                  onClick={onAddItem}
                  className="px-3 py-1.5 text-xs font-medium bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors"
                >
                  + Add Item Manually
                </button>
                <button
                  onClick={onSeedSample}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-200 text-slate-800 rounded hover:bg-slate-300 transition-colors"
                >
                  Load Sample Pantry
                </button>
              </div>
            )}
          </div>
        ) : (
          filteredPantry.map(item => {
            const expStatus = getExpiryStatus(item.expiryDate);
            return (
              <div
                key={item.id}
                className="bg-white rounded-lg p-3 border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all flex items-start justify-between gap-2"
              >
                <div className="flex-1 min-w-0" onClick={() => onEditItem(item)}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-xs font-semibold text-slate-900 truncate">{item.name}</h3>
                    <span className="text-[10px] text-slate-400 font-normal">({item.category})</span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-600 mb-1">
                    <span className="font-semibold text-blue-900 tabular-nums">
                      {item.quantity} {item.unit}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span
                      className={`font-medium ${
                        expStatus.level === 'danger'
                          ? 'text-red-600'
                          : expStatus.level === 'warning'
                          ? 'text-amber-600'
                          : 'text-slate-400'
                      }`}
                    >
                      {expStatus.text}
                    </span>
                  </div>

                  {item.notes && (
                    <p className="text-[10px] text-slate-500 italic truncate">{item.notes}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onEditItem(item)}
                    className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                    title="Edit item"
                    aria-label={`Edit ${item.name}`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    title="Delete item"
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={onAddItem}
        className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-blue-900 hover:bg-blue-800 text-white shadow-lg flex items-center justify-center transition-transform active:scale-95"
        title="Add Ingredient"
        aria-label="Add Ingredient"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};
