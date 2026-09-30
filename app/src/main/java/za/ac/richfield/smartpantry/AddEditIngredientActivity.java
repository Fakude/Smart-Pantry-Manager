package za.ac.richfield.smartpantry;

import android.graphics.Color;
import android.os.Bundle;
import android.text.InputType;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class AddEditIngredientActivity extends AppCompatActivity {
    private DatabaseHelper database;
    private EditText nameField;
    private EditText quantityField;
    private EditText unitField;
    private EditText categoryField;
    private EditText expiryField;
    private long itemId = -1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        database = new DatabaseHelper(this);
        itemId = getIntent().getLongExtra("item_id", -1);

        LinearLayout page = Ui.page(this, itemId == -1 ? "Add Ingredient" : "Edit Ingredient");
        nameField = addField(page, "Ingredient name", InputType.TYPE_CLASS_TEXT);
        quantityField = addField(page, "Quantity", InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_DECIMAL);
        unitField = addField(page, "Unit (g, kg, ml, pcs)", InputType.TYPE_CLASS_TEXT);
        categoryField = addField(page, "Category", InputType.TYPE_CLASS_TEXT);
        expiryField = addField(page, "Expiry date (optional)", InputType.TYPE_CLASS_DATETIME | InputType.TYPE_DATETIME_VARIATION_DATE);

        if (itemId != -1) {
            PantryItem item = database.getPantryItem(itemId);
            if (item != null) {
                nameField.setText(item.getName());
                quantityField.setText(String.valueOf(item.getQuantity()));
                unitField.setText(item.getUnit());
                categoryField.setText(item.getCategory());
                expiryField.setText(item.getExpiryDate());
            }
        }

        Button saveButton = Ui.button(this, "Save ingredient");
        saveButton.setOnClickListener(view -> saveItem());
        page.addView(saveButton);
        if (itemId != -1) {
            Button deleteButton = Ui.button(this, "Delete ingredient");
            deleteButton.setOnClickListener(view -> {
                database.deletePantryItem(itemId);
                finish();
            });
            page.addView(deleteButton);
        }
        setContentView(page);
    }

    private EditText addField(LinearLayout page, String hint, int inputType) {
        EditText field = new EditText(this);
        field.setHint(hint);
        field.setInputType(inputType);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        );
        params.setMargins(0, Ui.dp(this, 6), 0, Ui.dp(this, 12));
        field.setLayoutParams(params);
        field.setPadding(Ui.dp(this, 12), Ui.dp(this, 12), Ui.dp(this, 12), Ui.dp(this, 12));
        field.setBackgroundColor(Color.WHITE);
        page.addView(field);
        return field;
    }

    private void saveItem() {
        String name = nameField.getText().toString().trim();
        String quantityText = quantityField.getText().toString().trim();
        String unit = unitField.getText().toString().trim();

        if (name.isEmpty()) {
            nameField.setError("Enter an ingredient name");
            return;
        }
        if (quantityText.isEmpty() || unit.isEmpty()) {
            quantityField.setError("Enter a quantity and unit");
            return;
        }

        double quantity;
        try {
            quantity = Double.parseDouble(quantityText);
        } catch (NumberFormatException exception) {
            quantityField.setError("Enter a valid number");
            return;
        }
        if (Double.isNaN(quantity) || Double.isInfinite(quantity) || quantity <= 0) {
            quantityField.setError("Quantity must be greater than zero");
            return;
        }

        PantryItem item = new PantryItem(itemId, name, quantity, unit,
                categoryField.getText().toString().trim(), expiryField.getText().toString().trim());
        if (itemId == -1) {
            database.addPantryItem(item);
        } else {
            database.updatePantryItem(item);
        }
        Toast.makeText(this, "Ingredient saved", Toast.LENGTH_SHORT).show();
        finish();
    }
}
