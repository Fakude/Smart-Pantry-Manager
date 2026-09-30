package za.ac.richfield.smartpantry;

import android.app.Activity;
import android.graphics.Color;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

public class RecipeAdapter extends RecyclerView.Adapter<RecipeAdapter.RecipeViewHolder> {
    public interface Listener {
        void onSelect(Recipe recipe);
    }

    private final Activity activity;
    private final Listener listener;
    private final List<Recipe> recipes = new ArrayList<>();

    public RecipeAdapter(Activity activity, Listener listener) {
        this.activity = activity;
        this.listener = listener;
    }

    public void setRecipes(List<Recipe> newRecipes) {
        recipes.clear();
        recipes.addAll(newRecipes);
        notifyDataSetChanged();
    }

    @Override
    public RecipeViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        TextView title = Ui.text(activity, "", 16);
        title.setPadding(Ui.dp(activity, 16), Ui.dp(activity, 14), Ui.dp(activity, 16), Ui.dp(activity, 14));
        title.setBackgroundColor(Color.WHITE);

        RecyclerView.LayoutParams params = new RecyclerView.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        params.setMargins(0, Ui.dp(activity, 6), 0, Ui.dp(activity, 6));
        title.setLayoutParams(params);

        return new RecipeViewHolder(title);
    }

    @Override
    public void onBindViewHolder(RecipeViewHolder holder, int position) {
        Recipe recipe = recipes.get(position);
        holder.title.setText(recipe.getName() + "\n" + recipe.getCategory() + " · Ready to cook");
        holder.title.setOnClickListener(view -> listener.onSelect(recipe));
    }

    @Override
    public int getItemCount() {
        return recipes.size();
    }

    static class RecipeViewHolder extends RecyclerView.ViewHolder {
        final TextView title;

        RecipeViewHolder(TextView title) {
            super(title);
            this.title = title;
        }
    }
}
