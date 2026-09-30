package za.ac.richfield.smartpantry;

import java.util.List;
import java.util.Locale;

public class StrictMatchingEngine {
    public static boolean canMake(Recipe recipe, List<PantryItem> pantry) {
        if (recipe.getIngredients().isEmpty()) return false;

        for (RecipeIngredient required : recipe.getIngredients()) {
            PantryItem found = null;

            for (PantryItem item : pantry) {
                if (normalize(item.getName()).equals(normalize(required.getName()))) {
                    found = item;
                    break;
                }
            }

            if (found == null || !hasEnough(found, required)) {
                return false;
            }
        }
        return true;
    }

    private static String normalize(String name) {
        String value = name.trim().toLowerCase(Locale.ROOT);
        if (value.endsWith("tomatoes")) return value.substring(0, value.length() - 2);
        if (value.endsWith("potatoes")) return value.substring(0, value.length() - 2);
        if (value.endsWith("ies")) return value.substring(0, value.length() - 3) + "y";
        if (value.endsWith("s") && !value.endsWith("ss")) return value.substring(0, value.length() - 1);
        return value;
    }

    private static boolean hasEnough(PantryItem item, RecipeIngredient required) {
        String pantryUnit = item.getUnit().trim().toLowerCase(Locale.ROOT);
        String recipeUnit = required.getUnit().trim().toLowerCase(Locale.ROOT);

        if (isMass(pantryUnit) && isMass(recipeUnit)) {
            return toGrams(item.getQuantity(), pantryUnit) >= toGrams(required.getQuantity(), recipeUnit);
        }
        if (isVolume(pantryUnit) && isVolume(recipeUnit)) {
            return toMillilitres(item.getQuantity(), pantryUnit) >= toMillilitres(required.getQuantity(), recipeUnit);
        }
        if (isCount(pantryUnit) && isCount(recipeUnit)) {
            return item.getQuantity() >= required.getQuantity();
        }
        return pantryUnit.equals(recipeUnit) && item.getQuantity() >= required.getQuantity();
    }

    private static boolean isMass(String unit) {
        return unit.equals("g") || unit.equals("gram") || unit.equals("grams") || unit.equals("kg") || unit.equals("kilogram") || unit.equals("kilograms");
    }

    private static boolean isVolume(String unit) {
        return unit.equals("ml") || unit.equals("millilitre") || unit.equals("millilitres") || unit.equals("l") || unit.equals("litre") || unit.equals("litres");
    }

    private static boolean isCount(String unit) {
        return unit.equals("pcs") || unit.equals("piece") || unit.equals("pieces") || unit.equals("clove") || unit.equals("cloves") || unit.equals("slice") || unit.equals("slices") || unit.equals("can") || unit.equals("cans");
    }

    private static double toGrams(double quantity, String unit) {
        return unit.startsWith("kg") || unit.startsWith("kilogram") ? quantity * 1000 : quantity;
    }

    private static double toMillilitres(double quantity, String unit) {
        return unit.equals("l") || unit.startsWith("litre") ? quantity * 1000 : quantity;
    }
}