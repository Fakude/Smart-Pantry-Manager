package za.ac.richfield.smartpantry;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import java.util.ArrayList;
import java.util.List;

public class DatabaseHelper extends SQLiteOpenHelper {
    private static final String DATABASE_NAME = "smart_pantry.db";
    private static final int DATABASE_VERSION = 1;

    public DatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("CREATE TABLE pantry (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, quantity REAL NOT NULL, unit TEXT NOT NULL, category TEXT, expiry TEXT)");
        db.execSQL("CREATE TABLE recipes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, category TEXT, method TEXT)");
        db.execSQL("CREATE TABLE recipe_ingredients (id INTEGER PRIMARY KEY AUTOINCREMENT, recipe_id INTEGER NOT NULL, name TEXT NOT NULL, quantity REAL NOT NULL, unit TEXT NOT NULL)");
        seedPantry(db);
        seedRecipes(db);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS recipe_ingredients");
        db.execSQL("DROP TABLE IF EXISTS recipes");
        db.execSQL("DROP TABLE IF EXISTS pantry");
        onCreate(db);
    }

    public long addPantryItem(PantryItem item) {
        return getWritableDatabase().insert("pantry", null, pantryValues(item));
    }

    public boolean updatePantryItem(PantryItem item) {
        return getWritableDatabase().update("pantry", pantryValues(item), "id = ?", new String[]{String.valueOf(item.getId())}) > 0;
    }

    public boolean deletePantryItem(long id) {
        return getWritableDatabase().delete("pantry", "id = ?", new String[]{String.valueOf(id)}) > 0;
    }

    public List<PantryItem> getPantryItems() {
        List<PantryItem> items = new ArrayList<>();
        try (Cursor cursor = getReadableDatabase().query("pantry", null, null, null, null, null, "name ASC")) {
            while (cursor.moveToNext()) {
                items.add(new PantryItem(
                        cursor.getLong(cursor.getColumnIndexOrThrow("id")),
                        cursor.getString(cursor.getColumnIndexOrThrow("name")),
                        cursor.getDouble(cursor.getColumnIndexOrThrow("quantity")),
                        cursor.getString(cursor.getColumnIndexOrThrow("unit")),
                        cursor.getString(cursor.getColumnIndexOrThrow("category")),
                        cursor.getString(cursor.getColumnIndexOrThrow("expiry"))));
            }
        }
        return items;
    }

    public PantryItem getPantryItem(long id) {
        try (Cursor cursor = getReadableDatabase().query("pantry", null, "id = ?", new String[]{String.valueOf(id)}, null, null, null)) {
            if (cursor.moveToFirst()) {
                return new PantryItem(
                        cursor.getLong(cursor.getColumnIndexOrThrow("id")),
                        cursor.getString(cursor.getColumnIndexOrThrow("name")),
                        cursor.getDouble(cursor.getColumnIndexOrThrow("quantity")),
                        cursor.getString(cursor.getColumnIndexOrThrow("unit")),
                        cursor.getString(cursor.getColumnIndexOrThrow("category")),
                        cursor.getString(cursor.getColumnIndexOrThrow("expiry")));
            }
        }
        return null;
    }

    public List<Recipe> getRecipes() {
        List<Recipe> recipes = new ArrayList<>();
        try (Cursor cursor = getReadableDatabase().query("recipes", null, null, null, null, null, "name ASC")) {
            while (cursor.moveToNext()) {
                long recipeId = cursor.getLong(cursor.getColumnIndexOrThrow("id"));
                recipes.add(new Recipe(
                        recipeId,
                        cursor.getString(cursor.getColumnIndexOrThrow("name")),
                        cursor.getString(cursor.getColumnIndexOrThrow("category")),
                        cursor.getString(cursor.getColumnIndexOrThrow("method")),
                        getRecipeIngredients(recipeId)));
            }
        }
        return recipes;
    }

    public Recipe getRecipe(long id) {
        for (Recipe recipe : getRecipes()) {
            if (recipe.getId() == id) return recipe;
        }
        return null;
    }

    public void resetData() {
        SQLiteDatabase db = getWritableDatabase();
        db.delete("recipe_ingredients", null, null);
        db.delete("recipes", null, null);
        db.delete("pantry", null, null);
        seedPantry(db);
        seedRecipes(db);
    }

    private ContentValues pantryValues(PantryItem item) {
        ContentValues values = new ContentValues();
        values.put("name", item.getName().trim());
        values.put("quantity", item.getQuantity());
        values.put("unit", item.getUnit());
        values.put("category", item.getCategory());
        values.put("expiry", item.getExpiryDate());
        return values;
    }

    private List<RecipeIngredient> getRecipeIngredients(long recipeId) {
        List<RecipeIngredient> ingredients = new ArrayList<>();
        try (Cursor cursor = getReadableDatabase().query("recipe_ingredients", null, "recipe_id = ?", new String[]{String.valueOf(recipeId)}, null, null, null)) {
            while (cursor.moveToNext()) {
                ingredients.add(new RecipeIngredient(
                        cursor.getString(cursor.getColumnIndexOrThrow("name")),
                        cursor.getDouble(cursor.getColumnIndexOrThrow("quantity")),
                        cursor.getString(cursor.getColumnIndexOrThrow("unit"))));
            }
        }
        return ingredients;
    }

    private void addRecipe(SQLiteDatabase db, String name, String category, String method, String[][] ingredients) {
        ContentValues recipeValues = new ContentValues();
        recipeValues.put("name", name);
        recipeValues.put("category", category);
        recipeValues.put("method", method);
        long recipeId = db.insert("recipes", null, recipeValues);

        for (String[] ingredient : ingredients) {
            ContentValues ingredientValues = new ContentValues();
            ingredientValues.put("recipe_id", recipeId);
            ingredientValues.put("name", ingredient[0]);
            ingredientValues.put("quantity", Double.parseDouble(ingredient[1]));
            ingredientValues.put("unit", ingredient[2]);
            db.insert("recipe_ingredients", null, ingredientValues);
        }
    }

    private void seedPantry(SQLiteDatabase db) {
        addPantryItem(db, "Eggs", 6, "pcs", "Dairy & Eggs");
        addPantryItem(db, "Spaghetti Pasta", 400, "g", "Pantry Staples");
        addPantryItem(db, "Tomatoes", 4, "pcs", "Produce");
        addPantryItem(db, "Garlic", 5, "cloves", "Produce");
        addPantryItem(db, "Olive Oil", 250, "ml", "Pantry Staples");
        addPantryItem(db, "Cooked White Rice", 300, "g", "Pantry Staples");
        addPantryItem(db, "Soy Sauce", 120, "ml", "Pantry Staples");
        addPantryItem(db, "Onions", 3, "pcs", "Produce");
        addPantryItem(db, "Cheddar Cheese", 150, "g", "Dairy & Eggs");
        addPantryItem(db, "Sliced Bread", 8, "slices", "Bakery");
    }

    private void addPantryItem(SQLiteDatabase db, String name, double quantity, String unit, String category) {
        ContentValues values = new ContentValues();
        values.put("name", name);
        values.put("quantity", quantity);
        values.put("unit", unit);
        values.put("category", category);
        values.put("expiry", "");
        db.insert("pantry", null, values);
    }

    private void seedRecipes(SQLiteDatabase db) {
        addRecipe(db, "Tomato Pasta", "Pasta", "Boil pasta. Cook tomatoes and garlic in oil, then mix with the pasta.", new String[][]{{"Spaghetti Pasta", "200", "g"}, {"Tomatoes", "3", "pcs"}, {"Garlic", "2", "cloves"}, {"Olive Oil", "30", "ml"}});
        addRecipe(db, "Egg Fried Rice", "Rice", "Scramble eggs. Fry rice with garlic and oil, then stir in soy sauce.", new String[][]{{"Cooked White Rice", "250", "g"}, {"Eggs", "2", "pcs"}, {"Garlic", "2", "cloves"}, {"Soy Sauce", "20", "ml"}, {"Olive Oil", "15", "ml"}});
        addRecipe(db, "Tomato and Egg Skillet", "Eggs", "Cook tomatoes, onion and garlic in oil. Add eggs and cook until set.", new String[][]{{"Eggs", "3", "pcs"}, {"Tomatoes", "3", "pcs"}, {"Onions", "1", "pcs"}, {"Garlic", "2", "cloves"}, {"Olive Oil", "20", "ml"}});
        addRecipe(db, "Cheese Toast", "Breakfast", "Toast the bread with cheese until the cheese melts.", new String[][]{{"Sliced Bread", "2", "slices"}, {"Cheddar Cheese", "40", "g"}});
        addRecipe(db, "Garlic Spaghetti", "Pasta", "Boil pasta. Lightly fry garlic in oil and mix with the pasta.", new String[][]{{"Spaghetti Pasta", "200", "g"}, {"Garlic", "3", "cloves"}, {"Olive Oil", "30", "ml"}});
        addRecipe(db, "Tomato Cheese Sandwich", "Lunch", "Add sliced tomato and cheese to bread and toast until warm.", new String[][]{{"Sliced Bread", "2", "slices"}, {"Tomatoes", "1", "pcs"}, {"Cheddar Cheese", "30", "g"}});
        addRecipe(db, "Onion Fried Rice", "Rice", "Fry onion in oil, add rice, then season with soy sauce.", new String[][]{{"Cooked White Rice", "250", "g"}, {"Onions", "1", "pcs"}, {"Soy Sauce", "15", "ml"}, {"Olive Oil", "15", "ml"}});
        addRecipe(db, "Cheese Omelette", "Eggs", "Beat eggs, cook in a pan, add cheese and fold.", new String[][]{{"Eggs", "2", "pcs"}, {"Cheddar Cheese", "30", "g"}, {"Olive Oil", "5", "ml"}});
        addRecipe(db, "Tomato Garlic Rice", "Rice", "Cook tomatoes and garlic in oil, then stir in the rice.", new String[][]{{"Cooked White Rice", "200", "g"}, {"Tomatoes", "2", "pcs"}, {"Garlic", "1", "cloves"}, {"Olive Oil", "10", "ml"}});
        addRecipe(db, "Simple Shakshuka", "Eggs", "Cook tomato, onion and garlic in a pan. Add eggs and cover until cooked.", new String[][]{{"Eggs", "2", "pcs"}, {"Tomatoes", "2", "pcs"}, {"Onions", "1", "pcs"}, {"Garlic", "1", "cloves"}});
        addRecipe(db, "Cheesy Scrambled Eggs", "Eggs", "Scramble eggs in a pan and stir in grated cheese.", new String[][]{{"Eggs", "2", "pcs"}, {"Cheddar Cheese", "25", "g"}, {"Olive Oil", "5", "ml"}});
        addRecipe(db, "Tomato Garlic Soup", "Soup", "Simmer tomatoes, garlic and onion in water until soft, then mash.", new String[][]{{"Tomatoes", "3", "pcs"}, {"Garlic", "1", "cloves"}, {"Onions", "1", "pcs"}, {"Water", "400", "ml"}});
        addRecipe(db, "Onion and Cheese Toast", "Lunch", "Cook onion until soft. Add it and cheese to bread and toast.", new String[][]{{"Onions", "1", "pcs"}, {"Cheddar Cheese", "30", "g"}, {"Sliced Bread", "2", "slices"}});
        addRecipe(db, "Soy Garlic Rice", "Rice", "Warm garlic in oil, add cooked rice and soy sauce, then stir.", new String[][]{{"Cooked White Rice", "250", "g"}, {"Garlic", "2", "cloves"}, {"Soy Sauce", "15", "ml"}, {"Olive Oil", "10", "ml"}});
        addRecipe(db, "Tomato Pasta Bake", "Pasta", "Boil pasta, mix with tomato and cheese, then bake until warm.", new String[][]{{"Spaghetti Pasta", "200", "g"}, {"Tomatoes", "2", "pcs"}, {"Cheddar Cheese", "50", "g"}});
        addRecipe(db, "Egg and Cheese Toast", "Breakfast", "Cook eggs and cheese together and serve on toasted bread.", new String[][]{{"Eggs", "2", "pcs"}, {"Cheddar Cheese", "25", "g"}, {"Sliced Bread", "2", "slices"}});
        addRecipe(db, "Tomato Onion Salad", "Salad", "Chop tomato and onion. Add oil and mix before serving.", new String[][]{{"Tomatoes", "2", "pcs"}, {"Onions", "1", "pcs"}, {"Olive Oil", "10", "ml"}});
        addRecipe(db, "Garlic Cheese Pasta", "Pasta", "Boil pasta, stir through cooked garlic and grated cheese.", new String[][]{{"Spaghetti Pasta", "200", "g"}, {"Garlic", "2", "cloves"}, {"Cheddar Cheese", "40", "g"}});
        addRecipe(db, "Rice and Tomato Bowl", "Rice", "Warm rice with chopped tomatoes, onion and soy sauce.", new String[][]{{"Cooked White Rice", "200", "g"}, {"Tomatoes", "2", "pcs"}, {"Onions", "1", "pcs"}, {"Soy Sauce", "10", "ml"}});
        addRecipe(db, "Pantry Frittata", "Eggs", "Cook onion in oil, add beaten eggs and cheese, and cook until firm.", new String[][]{{"Eggs", "3", "pcs"}, {"Onions", "1", "pcs"}, {"Cheddar Cheese", "30", "g"}, {"Olive Oil", "10", "ml"}});
    }
}