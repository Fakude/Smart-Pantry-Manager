package za.ac.richfield.smartpantry;

import android.os.Bundle;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class RecipeDetailActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        DatabaseHelper database = new DatabaseHelper(this);
        long recipeId = getIntent().getLongExtra("recipe_id", -1);
        Recipe recipe = database.getRecipe(recipeId);

        LinearLayout page = Ui.page(this, recipe == null ? "Recipe" : recipe.getName());
        if (recipe == null) {
            page.addView(Ui.text(this, "Recipe not found.", 16));
        } else {
            page.addView(Ui.text(this, recipe.getCategory(), 14));
            page.addView(Ui.text(this, "Ingredients", 18));
            for (RecipeIngredient ingredient : recipe.getIngredients()) {
                page.addView(Ui.text(this,
                        "• " + ingredient.getQuantity() + " " + ingredient.getUnit() + " " + ingredient.getName(), 15));
            }
            TextView methodTitle = Ui.text(this, "Method", 18);
            methodTitle.setPadding(0, Ui.dp(this, 16), 0, Ui.dp(this, 4));
            page.addView(methodTitle);
            page.addView(Ui.text(this, recipe.getMethod(), 15));
        }

        ScrollView scrollView = new ScrollView(this);
        scrollView.addView(page);
        setContentView(scrollView);
    }
}