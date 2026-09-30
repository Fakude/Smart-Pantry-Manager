package za.ac.richfield.smartpantry;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

public class SuggestedRecipesActivity extends AppCompatActivity implements RecipeAdapter.Listener {
    private DatabaseHelper database;
    private RecipeAdapter adapter;
    private RecyclerView recipeList;
    private TextView emptyMessage;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        database = new DatabaseHelper(this);

        LinearLayout page = Ui.page(this, "Suggested Recipes");
        TextView rule = Ui.text(this, "Every ingredient must be in your pantry.", 14);
        rule.setTextColor(Ui.MUTED);
        page.addView(rule);

        emptyMessage = Ui.text(this, "No recipes match your pantry yet. Add more ingredients.", 16);
        emptyMessage.setPadding(0, Ui.dp(this, 24), 0, Ui.dp(this, 24));
        page.addView(emptyMessage);

        recipeList = new RecyclerView(this);
        recipeList.setLayoutManager(new LinearLayoutManager(this));
        adapter = new RecipeAdapter(this, this);
        recipeList.setAdapter(adapter);
        page.addView(recipeList, new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, 0, 1));
        page.addView(Ui.navigation(this, "Recipes"));
        setContentView(page);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (database == null || adapter == null) return;

        List<Recipe> matches = new ArrayList<>();
        List<PantryItem> pantry = database.getPantryItems();
        for (Recipe recipe : database.getRecipes()) {
            if (StrictMatchingEngine.canMake(recipe, pantry)) matches.add(recipe);
        }
        adapter.setRecipes(matches);
        emptyMessage.setVisibility(matches.isEmpty() ? View.VISIBLE : View.GONE);
        recipeList.setVisibility(matches.isEmpty() ? View.GONE : View.VISIBLE);
    }

    @Override
    public void onSelect(Recipe recipe) {
        Intent intent = new Intent(this, RecipeDetailActivity.class);
        intent.putExtra("recipe_id", recipe.getId());
        startActivity(intent);
    }
}