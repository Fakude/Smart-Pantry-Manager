import React, { useState } from 'react';
import { Recipe, PantryItem, UserSettings } from '../../types';
import { evaluateRecipeStrictMatch } from '../../utils/matchingEngine';
import { ArrowLeft, Clock, Users, Flame, Check, AlertCircle } from 'lucide-react';

interface RecipeDetailScreenProps {
  recipe: Recipe;
  pantry: PantryItem[];
  settings: UserSettings;
  onBack: () => void;
  onCookRecipe: (recipe: Recipe) => void;
}

export const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({
  recipe,
  pantry,
  settings,
  onBack,
  onCookRecipe,
}) => {
  const [cookedSuccess, setCookedSuccess] = useState(false);

  const evaluation = evaluateRecipeStrictMatch(recipe, pantry, settings.fuzzyMatching);

  const handleCook = () => {
    setCookedSuccess(true);
    onCookRecipe(recipe);
    setTimeout(() => {
      setCookedSuccess(false);
    }, 4000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Top App Bar */}
      <div className="bg-blue-900 text-white px-4 py-3 shadow-md flex items-center gap-3 shrink-0">
        <button
          onClick={onBack}
          className="p-1 rounded-full hover:bg-blue-800 transition-colors"
          title="Back"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-base font-semibold truncate">{recipe.name}</h1>
          <p className="text-[10px] text-blue-200">Recipe Detail Activity</p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Photo */}
        <div className="relative h-44 bg-slate-200 overflow-hidden">
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
            <div className="text-white">
              <span className="text-[10px] font-medium uppercase tracking-wider text-blue-300">
                {recipe.category}
              </span>
              <h2 className="text-base font-bold leading-tight drop-shadow-xs">
                {recipe.name}
              </h2>
            </div>
          </div>
        </div>

        {/* Cook Success Banner */}
        {cookedSuccess && (
          <div className="m-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <strong>Recorded!</strong> Ingredients deducted from your pantry database in SQLite.
            </div>
          </div>
        )}

        <div className="p-4 space-y-4">
          {/* Metadata Grid */}
          <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-lg border border-slate-200 shadow-xs text-center text-xs">
            <div>
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[10px]">Total Time</span>
              </div>
              <span className="font-semibold text-slate-800">
                {recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins
              </span>
            </div>

            <div>
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                <Users className="w-3.5 h-3.5" />
                <span className="text-[10px]">Yield</span>
              </div>
              <span className="font-semibold text-slate-800">
                {recipe.servings} Servings
              </span>
            </div>

            <div>
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                <Flame className="w-3.5 h-3.5" />
                <span className="text-[10px]">Difficulty</span>
              </div>
              <span className="font-semibold text-slate-800">
                {recipe.difficulty}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              About This Dish
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {recipe.description}
            </p>
          </div>

          {/* Required Ingredients Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Ingredients Inventory Check
              </h3>
              <span className="text-[10px] text-slate-500 font-medium">
                {evaluation.matchedCount}/{evaluation.totalCount} present
              </span>
            </div>

            <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
              {recipe.ingredients.map((ing, idx) => {
                const matched = evaluation.matchedDetails.find(
                  m => m.name.toLowerCase() === ing.name.toLowerCase()
                );
                const missing = evaluation.missingDetails.find(
                  m => m.name.toLowerCase() === ing.name.toLowerCase()
                );

                const isAvailable = Boolean(matched);

                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between py-1.5 px-2 rounded text-xs transition-colors ${
                      isAvailable ? 'bg-emerald-50/60 text-slate-800' : 'bg-red-50/60 text-red-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isAvailable ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      )}
                      <span className={isAvailable ? 'font-medium' : 'font-medium text-red-800'}>
                        {ing.name}
                      </span>
                    </div>

                    <div className="text-[11px] text-right">
                      <span className="font-semibold text-slate-700">
                        {ing.quantity} {ing.unit}
                      </span>
                      {isAvailable ? (
                        <span className="text-[10px] text-emerald-700 block">
                          (In pantry: {matched?.pantryQty} {matched?.unit})
                        </span>
                      ) : (
                        <span className="text-[10px] text-red-600 block">
                          {missing?.reason === 'insufficient_quantity'
                            ? `(Only ${missing?.pantryQty} in pantry)`
                            : '(Missing)'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cooking Instructions */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Preparation Steps
            </h3>
            <ol className="space-y-2.5">
              {recipe.steps.map((step, idx) => (
                <li key={idx} className="flex gap-2.5 text-xs text-slate-700 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Action Button: Cooked this */}
          <div className="pt-2">
            <button
              onClick={handleCook}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Cooked This Recipe (Deduct from Pantry Database)
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-1.5">
              Simulates SQLite transaction updating ingredient balances.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
