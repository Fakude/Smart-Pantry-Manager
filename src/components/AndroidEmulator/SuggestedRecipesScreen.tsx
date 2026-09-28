import React, { useState } from 'react';
import { Recipe, PantryItem, UserSettings, MatchingResult } from '../../types';
import { evaluateRecipeStrictMatch } from '../../utils/matchingEngine';
import { ChefHat, Clock, AlertTriangle, CheckCircle2, Sparkles, Filter, Plus } from 'lucide-react';

interface SuggestedRecipesScreenProps {
  recipes: Recipe[];
  pantry: PantryItem[];
  settings: UserSettings;
  onSelectRecipe: (recipe: Recipe) => void;
  onNavigateToPantry: () => void;
  onQuickAddIngredient: (name: string, quantity: number, unit: string) => void;
}

export const SuggestedRecipesScreen: React.FC<SuggestedRecipesScreenProps> = ({
  recipes,
  pantry,
  settings,
  onSelectRecipe,
  onNavigateToPantry,
  onQuickAddIngredient,
}) => {
  const [showAlmostThere, setShowAlmostThere] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Evaluate all recipes
  const evaluations: MatchingResult[] = recipes.map(recipe =>
    evaluateRecipeStrictMatch(recipe, pantry, settings.fuzzyMatching)
  );

  const strictMatches = evaluations.filter(e => e.isStrictMatch);
  const almostThereMatches = evaluations.filter(e => e.isAlmostThere);

  const activeResults = showAlmostThere
    ? [...strictMatches, ...almostThereMatches]
    : strictMatches;

  const categories = ['All', 'Pasta & Noodles', 'Rice & Grains', 'Eggs & Breakfast', 'Breakfast & Brunch', 'Soups & Stews', 'Sandwiches & Wraps'];

  const filteredResults = activeResults.filter(r => {
    if (selectedCategory === 'All') return true;
    return r.recipe.category === selectedCategory;
  });

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Android Top App Bar */}
      <div className="bg-blue-900 text-white px-4 py-3 shadow-md shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold">Suggested Recipes</h1>
            <p className="text-[10px] text-blue-200">
              {showAlmostThere ? 'Showing Strict + 1 Missing' : 'Strict Matching (0 Shopping Needed)'}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-600 rounded text-white tabular-nums">
              {strictMatches.length} Ready
            </span>
          </div>
        </div>
      </div>

      {/* Strict Rule Notification & Bonus Toggle */}
      <div className="px-3 py-2 bg-blue-50 border-b border-blue-100 flex items-center justify-between text-xs text-blue-950 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-[11px] truncate">
            {showAlmostThere
              ? 'Bonus Mode: Strict + 1 Missing'
              : 'Strict Rule: 100% ingredients in pantry'}
          </span>
        </div>

        {/* Stretch Toggle for Section 8 Bonus credit */}
        <label className="flex items-center gap-1.5 cursor-pointer shrink-0 ml-2">
          <span className="text-[10px] font-medium text-blue-800 whitespace-nowrap">Almost There (+1)</span>
          <input
            type="checkbox"
            checked={showAlmostThere}
            onChange={e => setShowAlmostThere(e.target.checked)}
            className="w-3.5 h-3.5 accent-blue-900 cursor-pointer"
          />
        </label>
      </div>

      {/* Category Pills */}
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

      {/* Recipe List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 mb-3">
              <ChefHat className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              No Recipes Match Your Pantry Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mb-4">
              Under the <strong>Strict Matching Rule</strong>, recipes only appear when every single ingredient is already present in your pantry in sufficient quantity.
            </p>

            <div className="bg-white border border-slate-200 rounded-lg p-3 text-left w-full max-w-xs mb-4 shadow-xs">
              <p className="text-[11px] font-semibold text-slate-700 mb-2">
                Quick Test: Add ingredients to unlock recipes:
              </p>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => {
                    onQuickAddIngredient('Spaghetti Pasta', 250, 'g');
                    onQuickAddIngredient('Tomatoes', 3, 'pcs');
                    onQuickAddIngredient('Garlic', 2, 'cloves');
                    onQuickAddIngredient('Olive Oil', 30, 'ml');
                  }}
                  className="flex items-center justify-between text-xs px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded font-medium transition-colors text-left"
                >
                  <span>+ Pasta, Tomatoes, Garlic, Oil</span>
                  <span className="text-[10px] text-blue-600">&rarr; Tomato Pasta</span>
                </button>

                <button
                  onClick={() => {
                    onQuickAddIngredient('Cooked White Rice', 250, 'g');
                    onQuickAddIngredient('Eggs', 2, 'pcs');
                    onQuickAddIngredient('Soy Sauce', 20, 'ml');
                    onQuickAddIngredient('Garlic', 2, 'cloves');
                    onQuickAddIngredient('Olive Oil', 15, 'ml');
                  }}
                  className="flex items-center justify-between text-xs px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded font-medium transition-colors text-left"
                >
                  <span>+ Rice, Eggs, Soy Sauce, Garlic</span>
                  <span className="text-[10px] text-emerald-600">&rarr; Fried Rice</span>
                </button>
              </div>
            </div>

            <button
              onClick={onNavigateToPantry}
              className="px-3.5 py-1.5 text-xs font-medium bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors"
            >
              Go to Pantry to Add Items
            </button>
          </div>
        ) : (
          filteredResults.map(res => {
            const isStrict = res.isStrictMatch;
            return (
              <div
                key={res.recipe.id}
                onClick={() => onSelectRecipe(res.recipe)}
                className={`bg-white rounded-lg border overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer ${
                  isStrict ? 'border-slate-200 hover:border-blue-400' : 'border-amber-200/90 bg-amber-50/20'
                }`}
              >
                {/* Recipe Card Image */}
                <div className="relative h-28 bg-slate-100 overflow-hidden">
                  <img
                    src={res.recipe.imageUrl}
                    alt={res.recipe.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Styled CSS Fallback Container
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    {isStrict ? (
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-600 text-white rounded shadow-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        100% Strict Match
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500 text-white rounded shadow-xs flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Almost There (1 Missing)
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 text-[10px] font-medium bg-black/60 text-white rounded backdrop-blur-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {res.recipe.prepTimeMinutes + res.recipe.cookTimeMinutes}m
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-xs font-semibold text-slate-900 truncate">
                      {res.recipe.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 shrink-0 font-normal">
                      {res.recipe.difficulty}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">
                    {res.recipe.description}
                  </p>

                  {/* Ingredient Status Bar */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">
                      <strong>{res.matchedCount}</strong> of <strong>{res.totalCount}</strong> ingredients in pantry
                    </span>

                    {res.missingCount > 0 ? (
                      <span className="text-amber-700 font-medium text-[10px]">
                        Need: {res.missingDetails[0]?.name}
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-medium text-[10px]">
                        Ready to cook &rarr;
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
