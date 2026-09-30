package za.ac.richfield.smartpantry;

import java.util.List;

public class Recipe {
    private final long id;
    private final String name;
    private final String category;
    private final String method;
    private final List<RecipeIngredient> ingredients;

    public Recipe(long id, String name, String category, String method, List<RecipeIngredient> ingredients) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.method = method;
        this.ingredients = ingredients;
    }

    public long getId() { return id; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public String getMethod() { return method; }
    public List<RecipeIngredient> getIngredients() { return ingredients; }
}