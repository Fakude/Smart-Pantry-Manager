package za.ac.richfield.smartpantry;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

public class MainActivity extends AppCompatActivity implements PantryAdapter.Listener {
    private DatabaseHelper database;
    private PantryAdapter adapter;
    private RecyclerView pantryList;
    private TextView emptyMessage;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        database = new DatabaseHelper(this);

        LinearLayout page = Ui.page(this, "My Pantry");
        TextView intro = Ui.text(this, "Ingredients you have at home", 14);
        intro.setTextColor(Ui.MUTED);
        page.addView(intro);

        emptyMessage = Ui.text(this, "Your pantry is empty. Add an ingredient to get started.", 16);
        emptyMessage.setPadding(0, Ui.dp(this, 24), 0, Ui.dp(this, 24));
        page.addView(emptyMessage);

        pantryList = new RecyclerView(this);
        pantryList.setLayoutManager(new LinearLayoutManager(this));
        adapter = new PantryAdapter(this, this);
        pantryList.setAdapter(adapter);
        page.addView(pantryList, new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, 0, 1));

        Button addButton = Ui.button(this, "Add ingredient");
        addButton.setOnClickListener(view -> startActivity(new Intent(this, AddEditIngredientActivity.class)));
        page.addView(addButton);
        page.addView(Ui.navigation(this, "Pantry"));
        setContentView(page);
    }

    @Override
    protected void onResume() {
        super.onResume();
        refreshItems();
    }

    private void refreshItems() {
        adapter.setItems(database.getPantryItems());
        boolean isEmpty = adapter.getItemCount() == 0;
        emptyMessage.setVisibility(isEmpty ? View.VISIBLE : View.GONE);
        pantryList.setVisibility(isEmpty ? View.GONE : View.VISIBLE);
    }

    @Override
    public void onEdit(PantryItem item) {
        Intent intent = new Intent(this, AddEditIngredientActivity.class);
        intent.putExtra("item_id", item.getId());
        startActivity(intent);
    }

    @Override
    public void onDelete(PantryItem item) {
        new AlertDialog.Builder(this)
                .setTitle("Delete ingredient")
                .setMessage("Remove " + item.getName() + " from the pantry?")
                .setNegativeButton("Cancel", null)
                .setPositiveButton("Delete", (dialog, which) -> {
                    database.deletePantryItem(item.getId());
                    refreshItems();
                })
                .show();
    }
}