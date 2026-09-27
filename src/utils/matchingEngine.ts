import { PantryItem, Recipe, MatchingResult } from '../types';

/**
 * Normalizes ingredient names to handle plurals and minor variations
 * e.g., 'Tomatoes' -> 'tomato', 'Eggs' -> 'egg', 'Potatoes' -> 'potato'
 */
export function normalizeIngredientName(name: string): string {
  let cleaned = name.trim().toLowerCase();
  
  // Strip common adjectives or preparations that might differ
  cleaned = cleaned.replace(/\b(fresh|ripe|leftover|cooked|raw|diced|sliced|chopped|minced|cloves of|clove of)\b/g, '').trim();
  cleaned = cleaned.replace(/\s+/g, ' ');

  // Handle irregular culinary plurals
  if (cleaned.endsWith('potatoes')) return cleaned.replace(/potatoes$/, 'potato');
  if (cleaned.endsWith('tomatoes')) return cleaned.replace(/tomatoes$/, 'tomato');
  if (cleaned.endsWith('cloves')) return cleaned.replace(/cloves$/, 'clove');
  if (cleaned.endsWith('leaves')) return cleaned.replace(/leaves$/, 'leaf');
  if (cleaned.endsWith('loaves')) return cleaned.replace(/loaves$/, 'loaf');
  if (cleaned.endsWith('berries')) return cleaned.replace(/berries$/, 'berry');
  
  // Standard English plurals
  if (cleaned.endsWith('ies') && cleaned.length > 4) {
    return cleaned.slice(0, -3) + 'y';
  }
  if (cleaned.endsWith('es') && !cleaned.endsWith('cheese') && !cleaned.endsWith('rice') && cleaned.length > 3) {
    return cleaned.slice(0, -2);
  }
  if (cleaned.endsWith('s') && !cleaned.endsWith('ss') && !cleaned.endsWith('oats') && cleaned.length > 2) {
    return cleaned.slice(0, -1);
  }

  return cleaned;
}

/**
 * Converts compatible units into a common base unit for comparison
 * (e.g. grams and kilograms, milliliters and liters)
 */
export function convertToBaseUnit(qty: number, unit: string): { baseQty: number; baseType: 'mass' | 'volume' | 'count' | 'other' } {
  const u = unit.trim().toLowerCase();

  // Mass (base: gram)
  if (u === 'g' || u === 'gram' || u === 'grams') return { baseQty: qty, baseType: 'mass' };
  if (u === 'kg' || u === 'kilogram' || u === 'kilograms') return { baseQty: qty * 1000, baseType: 'mass' };
  if (u === 'mg') return { baseQty: qty / 1000, baseType: 'mass' };
  if (u === 'oz' || u === 'ounce' || u === 'ounces') return { baseQty: qty * 28.3495, baseType: 'mass' };
  if (u === 'lb' || u === 'lbs' || u === 'pound' || u === 'pounds') return { baseQty: qty * 453.592, baseType: 'mass' };

  // Volume (base: ml)
  if (u === 'ml' || u === 'milliliter' || u === 'milliliters') return { baseQty: qty, baseType: 'volume' };
  if (u === 'l' || u === 'liter' || u === 'liters') return { baseQty: qty * 1000, baseType: 'volume' };
  if (u === 'tbsp' || u === 'tablespoon' || u === 'tablespoons') return { baseQty: qty * 15, baseType: 'volume' };
  if (u === 'tsp' || u === 'teaspoon' || u === 'teaspoons') return { baseQty: qty * 5, baseType: 'volume' };
  if (u === 'cup' || u === 'cups') return { baseQty: qty * 240, baseType: 'volume' };

  // Count / Discrete (base: pieces)
  if (u === 'pcs' || u === 'piece' || u === 'pieces' || u === 'item' || u === 'items' || u === 'units' || u === 'cloves' || u === 'clove' || u === 'slices' || u === 'slice' || u === 'cans' || u === 'can') {
    return { baseQty: qty, baseType: 'count' };
  }

  // Fallback
  return { baseQty: qty, baseType: 'other' };
}

/**
 * Checks if pantry quantity satisfies recipe required quantity
 */
function isQuantitySufficient(pantryQty: number, pantryUnit: string, reqQty: number, reqUnit: string): boolean {
  const pConv = convertToBaseUnit(pantryQty, pantryUnit);
  const rConv = convertToBaseUnit(reqQty, reqUnit);

  // If compatible measurement types, compare base quantities
  if (pConv.baseType === rConv.baseType && pConv.baseType !== 'other') {
    return pConv.baseQty >= rConv.baseQty;
  }

  // If both are count-based (e.g. eggs, tomatoes, slices)
  if (pConv.baseType === 'count' && rConv.baseType === 'count') {
    return pantryQty >= reqQty;
  }

  // If units are identical string
  if (pantryUnit.trim().toLowerCase() === reqUnit.trim().toLowerCase()) {
    return pantryQty >= reqQty;
  }

  // Default comparison if reasonable
  return pantryQty >= reqQty;
}

/**
 * Executes the Strict Matching Rule (Section 2.3 of the brief)
 * A recipe may ONLY be suggested if EVERY single required ingredient is present
 * in the pantry with at least the required quantity.
 */
export function evaluateRecipeStrictMatch(recipe: Recipe, pantry: PantryItem[], fuzzyEnabled = true): MatchingResult {
  const matchedDetails: MatchingResult['matchedDetails'] = [];
  const missingDetails: MatchingResult['missingDetails'] = [];

  for (const reqIng of recipe.ingredients) {
    const normReq = fuzzyEnabled ? normalizeIngredientName(reqIng.name) : reqIng.name.trim().toLowerCase();

    // Find in pantry
    const matchingPantryItem = pantry.find(p => {
      const normPantry = fuzzyEnabled ? normalizeIngredientName(p.name) : p.name.trim().toLowerCase();
      return normPantry === normReq || normPantry.includes(normReq) || normReq.includes(normPantry);
    });

    if (!matchingPantryItem) {
      missingDetails.push({
        name: reqIng.name,
        requiredQty: reqIng.quantity,
        requiredUnit: reqIng.unit,
        pantryQty: 0,
        pantryUnit: reqIng.unit,
        reason: 'missing',
      });
    } else {
      // Check quantity
      const sufficient = isQuantitySufficient(
        matchingPantryItem.quantity,
        matchingPantryItem.unit,
        reqIng.quantity,
        reqIng.unit
      );

      if (sufficient) {
        matchedDetails.push({
          name: reqIng.name,
          requiredQty: reqIng.quantity,
          pantryQty: matchingPantryItem.quantity,
          unit: matchingPantryItem.unit,
        });
      } else {
        missingDetails.push({
          name: reqIng.name,
          requiredQty: reqIng.quantity,
          requiredUnit: reqIng.unit,
          pantryQty: matchingPantryItem.quantity,
          pantryUnit: matchingPantryItem.unit,
          reason: 'insufficient_quantity',
        });
      }
    }
  }

  const totalCount = recipe.ingredients.length;
  const missingCount = missingDetails.length;
  const matchedCount = matchedDetails.length;

  // STRICT RULE: All required ingredients must be matched with sufficient quantity
  const isStrictMatch = missingCount === 0;

  // ALMOST THERE: Exactly 1 ingredient missing or insufficient
  const isAlmostThere = missingCount === 1;

  return {
    recipe,
    isStrictMatch,
    isAlmostThere,
    missingCount,
    matchedCount,
    totalCount,
    missingDetails,
    matchedDetails,
  };
}

/**
 * Filter all recipes against current pantry using the strict rule
 */
export function getStrictSuggestedRecipes(recipes: Recipe[], pantry: PantryItem[], fuzzyEnabled = true): MatchingResult[] {
  return recipes
    .map(recipe => evaluateRecipeStrictMatch(recipe, pantry, fuzzyEnabled))
    .filter(result => result.isStrictMatch);
}

/**
 * Filter recipes that are missing exactly 1 ingredient (Section 2.3 & 8 bonus)
 */
export function getAlmostThereRecipes(recipes: Recipe[], pantry: PantryItem[], fuzzyEnabled = true): MatchingResult[] {
  return recipes
    .map(recipe => evaluateRecipeStrictMatch(recipe, pantry, fuzzyEnabled))
    .filter(result => result.isAlmostThere);
}
