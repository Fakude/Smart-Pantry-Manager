export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: 'Produce' | 'Dairy & Eggs' | 'Pantry Staples' | 'Meat & Seafood' | 'Bakery' | 'Condiments & Spices';
  expiryDate?: string;
  addedAt: string;
  notes?: string;
}

export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
  isOptional?: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  category: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  imageUrl: string;
}

export interface MatchingResult {
  recipe: Recipe;
  isStrictMatch: boolean;
  isAlmostThere: boolean; // Exactly 1 ingredient missing
  missingCount: number;
  matchedCount: number;
  totalCount: number;
  missingDetails: {
    name: string;
    requiredQty: number;
    requiredUnit: string;
    pantryQty: number;
    pantryUnit: string;
    reason: 'missing' | 'insufficient_quantity' | 'unit_mismatch';
  }[];
  matchedDetails: {
    name: string;
    requiredQty: number;
    pantryQty: number;
    unit: string;
  }[];
}

export interface UserSettings {
  studentName: string;
  studentNumber: string;
  institution: string;
  moduleCode: string;
  assignmentDate: string;
  expiringSoonDays: number;
  unitSystem: 'metric' | 'imperial';
  fuzzyMatching: boolean;
  enableAlmostThere: boolean;
  darkMode: boolean;
}

export interface GitCommit {
  hash: string;
  date: string;
  author: string;
  message: string;
  filesChanged: string[];
  description: string;
  stepNumber?: number;
  devStep?: string;
  folderName?: string;
}

export interface JavaCodeFile {
  path: string;
  name: string;
  category: 'activity' | 'adapter' | 'database' | 'model' | 'util' | 'layout' | 'manifest' | 'gradle' | 'docs';
  description: string;
  code: string;
}
