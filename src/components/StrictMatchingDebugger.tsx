import React, { useState } from 'react';
import { Recipe, PantryItem, UserSettings } from '../types';
import { evaluateRecipeStrictMatch, normalizeIngredientName } from '../utils/matchingEngine';
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';

interface StrictMatchingDebuggerProps {
  recipes: Recipe[];
  pantry: PantryItem[];
  settings: UserSettings;
  onAddIngredient: (name: string, quantity: number, unit: string) => void;
  onRemoveIngredient: (name: string) => void;
}

export const StrictMatchingDebugger: React.FC<StrictMatchingDebuggerProps> = ({
  recipes,
  pantry,
  settings,
  onAddIngredient,
  onRemoveIngredient,
}) => {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(recipes[0]?.id || 'rec-1');
  const [testWord, setTestWord] = useState('tomatoes');

  const selectedRecipe = recipes.find(r => r.id === selectedRecipeId) || recipes[0];
  const evaluation = selectedRecipe
    ? evaluateRecipeStrictMatch(selectedRecipe, pantry, settings.fuzzyMatching)
    : null;

  // Normalized test
  const normalizedTest = normalizeIngredientName(testWord);

  return (
    <div className="space-y-6">
      {/* Header explanation of Section 2.3 */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-900 rounded">
                Section 2.3 Core Logic
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Strict-Matching Rule Verification Lab
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              &quot;A recipe may only be shown as &apos;suggested&apos; if every single ingredient it requires is currently present in the user&apos;s pantry, in at least the required quantity. If a recipe needs 5 ingredients and the user has 4, it must NOT appear.&quot;
            </p>
          </div>
        </div>

        {/* Quick Test Rules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs text-slate-700">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
            <span className="font-semibold text-slate-900 block mb-0.5">1. 100% Completeness</span>
            <span className="text-[11px] text-slate-500">Every single required ingredient must exist in the pantry. No partial leaks.</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
            <span className="font-semibold text-slate-900 block mb-0.5">2. Quantity Sufficiency</span>
            <span className="text-[11px] text-slate-500">Pantry quantity must be greater than or equal to required recipe amount.</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
            <span className="font-semibold text-slate-900 block mb-0.5">3. Plural Robustness</span>
            <span className="text-[11px] text-slate-500">Normalized matching prevents &quot;tomato&quot; vs &quot;tomatoes&quot; false rejections.</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recipe Selector */}
        <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Select Recipe to Test ({recipes.length} available)
          </h3>
          <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
            {recipes.map(recipe => {
              const res = evaluateRecipeStrictMatch(recipe, pantry, settings.fuzzyMatching);
              return (
                <button
                  key={recipe.id}
                  onClick={() => setSelectedRecipeId(recipe.id)}
                  className={`w-full p-2.5 rounded-lg text-left text-xs transition-all flex items-center justify-between gap-2 ${
                    selectedRecipeId === recipe.id
                      ? 'bg-blue-900 text-white font-semibold shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate">{recipe.name}</p>
                    <p className={`text-[10px] ${selectedRecipeId === recipe.id ? 'text-blue-200' : 'text-slate-400'}`}>
                      {recipe.ingredients.length} ingredients required
                    </p>
                  </div>
                  <div>
                    {res.isStrictMatch ? (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${selectedRecipeId === recipe.id ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                        MATCH
                      </span>
                    ) : res.isAlmostThere ? (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${selectedRecipeId === recipe.id ? 'bg-amber-400 text-amber-950' : 'bg-amber-100 text-amber-800'}`}>
                        -1 MISSING
                      </span>
                    ) : (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${selectedRecipeId === recipe.id ? 'bg-blue-800 text-blue-200' : 'bg-slate-200 text-slate-600'}`}>
                        FAIL ({res.missingCount})
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Execution Trace */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-5">
          {selectedRecipe && evaluation && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedRecipe.name}</h3>
                  <p className="text-xs text-slate-500">{selectedRecipe.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  {evaluation.isStrictMatch ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      STRICT MATCH QUALIFIED (100%)
                    </div>
                  ) : evaluation.isAlmostThere ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-semibold">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      EXCLUDED FROM MAIN LIST (Almost There)
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs font-semibold">
                      <XCircle className="w-4 h-4 text-red-600" />
                      EXCLUDED (Missing {evaluation.missingCount} ingredients)
                    </div>
                  )}
                </div>
              </div>

              {/* Step-by-Step Ingredients Trace Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Ingredient Verification Trace
                </h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 uppercase font-semibold">
                      <tr>
                        <th className="py-2 px-3">Recipe Requirement</th>
                        <th className="py-2 px-3">Pantry Status</th>
                        <th className="py-2 px-3">Quantity Check</th>
                        <th className="py-2 px-3 text-right">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedRecipe.ingredients.map((req, idx) => {
                        const matched = evaluation.matchedDetails.find(
                          m => m.name.toLowerCase() === req.name.toLowerCase()
                        );
                        const missing = evaluation.missingDetails.find(
                          m => m.name.toLowerCase() === req.name.toLowerCase()
                        );
                        const passed = Boolean(matched);

                        return (
                          <tr key={idx} className={passed ? 'bg-emerald-50/20' : 'bg-red-50/20'}>
                            <td className="py-2.5 px-3 font-semibold text-slate-900">
                              {req.name} ({req.quantity} {req.unit})
                            </td>

                            <td className="py-2.5 px-3 text-slate-600">
                              {passed ? (
                                <span className="text-emerald-700 font-medium">
                                  Found in Pantry ({matched?.pantryQty} {matched?.unit})
                                </span>
                              ) : missing?.reason === 'insufficient_quantity' ? (
                                <span className="text-amber-700 font-medium">
                                  Present but only {missing.pantryQty} {missing.pantryUnit}
                                </span>
                              ) : (
                                <span className="text-red-600 font-medium">
                                  Not in Pantry (0)
                                </span>
                              )}
                            </td>

                            <td className="py-2.5 px-3 text-slate-600">
                              {passed ? (
                                <span className="text-emerald-700">
                                  {matched?.pantryQty} &ge; {req.quantity} &#10003;
                                </span>
                              ) : missing?.reason === 'insufficient_quantity' ? (
                                <span className="text-amber-700">
                                  {missing.pantryQty} &lt; {req.quantity} (Deficit)
                                </span>
                              ) : (
                                <span className="text-red-500">
                                  0 &lt; {req.quantity}
                                </span>
                              )}
                            </td>

                            <td className="py-2.5 px-3 text-right">
                              {passed ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> SATISFIED
                                </span>
                              ) : (
                                <button
                                  onClick={() => onAddIngredient(req.name, req.quantity, req.unit)}
                                  className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded transition-colors"
                                  title="Add this ingredient to pantry to test match"
                                >
                                  + Add to Pantry
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Marker Rule Validation Callout */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <span className="font-semibold text-slate-900 block mb-1">
                  Marker Assessment Verification Note:
                </span>
                {evaluation.isStrictMatch ? (
                  <p>
                    All {evaluation.totalCount} required ingredients were identified in the pantry with sufficient quantities. This recipe correctly appears on the <strong>Suggested Recipes</strong> screen without needing any groceries.
                  </p>
                ) : (
                  <p>
                    This recipe was <strong>excluded from the suggestions list</strong> because {evaluation.missingCount} ingredient(s) failed the strict criteria. This validates that the algorithm strictly enforces Section 2.3 and avoids displaying unusable recipes to the user.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Fuzzy Pluralization & Messiness Testing Box */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Test Ingredient Plural / NLP Robustness (Section 2.3 requirement)
        </h3>
        <p className="text-xs text-slate-600 mb-3">
          &quot;A naive exact-string match that breaks on trivial differences (&apos;tomato&apos; vs &apos;tomatoes&apos;) will be marked down.&quot; Test how the engine stems common variations:
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={testWord}
            onChange={e => setTestWord(e.target.value)}
            placeholder="Type ingredient..."
            className="px-3 py-1.5 text-xs text-slate-900 bg-white border border-slate-300 rounded outline-none focus:border-blue-600"
          />

          <ArrowRight className="w-4 h-4 text-slate-400" />

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Normalized stem:</span>
            <span className="font-mono font-bold text-blue-900 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded">
              &quot;{normalizedTest}&quot;
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">Quick tests:</span>
            {['tomatoes', 'potatoes', 'cloves', 'eggs', 'onions', 'ripe fresh tomato'].map(sample => (
              <button
                key={sample}
                onClick={() => setTestWord(sample)}
                className="px-2 py-0.5 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
