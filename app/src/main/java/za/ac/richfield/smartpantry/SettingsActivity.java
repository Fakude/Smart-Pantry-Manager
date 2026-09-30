package za.ac.richfield.smartpantry;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.LinearLayout;
import android.widget.SeekBar;
import android.widget.Switch;
import android.widget.TextView;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

public class SettingsActivity extends AppCompatActivity {
    private DatabaseHelper database;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        database = new DatabaseHelper(this);
        SharedPreferences preferences = getSharedPreferences("pantry_settings", MODE_PRIVATE);

        LinearLayout page = Ui.page(this, "Settings");
        Switch expirySwitch = new Switch(this);
        expirySwitch.setText("Show expiry alerts");
        expirySwitch.setChecked(preferences.getBoolean("expiry_alerts", true));
        expirySwitch.setOnCheckedChangeListener((button, checked) ->
                preferences.edit().putBoolean("expiry_alerts", checked).apply());
        page.addView(expirySwitch);

        TextView daysLabel = Ui.text(this, "Alert days before expiry", 16);
        daysLabel.setPadding(0, Ui.dp(this, 20), 0, 0);
        page.addView(daysLabel);
        SeekBar daysBar = new SeekBar(this);
        daysBar.setMax(13);
        int savedDays = preferences.getInt("expiry_days", 3);
        daysBar.setProgress(savedDays - 1);
        TextView daysValue = Ui.text(this, savedDays + " days", 14);
        daysBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                int days = progress + 1;
                daysValue.setText(days + " days");
                preferences.edit().putInt("expiry_days", days).apply();
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) { }

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) { }
        });
        page.addView(daysBar);
        page.addView(daysValue);

        TextView storage = Ui.text(this, "Pantry and recipes are saved in SQLite on this device.", 14);
        storage.setPadding(0, Ui.dp(this, 20), 0, Ui.dp(this, 8));
        page.addView(storage);

        android.widget.Button resetButton = Ui.button(this, "Restore sample data");
        resetButton.setOnClickListener(view -> new AlertDialog.Builder(this)
                .setTitle("Restore sample data")
                .setMessage("This replaces your pantry with the sample items.")
                .setNegativeButton("Cancel", null)
                .setPositiveButton("Restore", (dialog, which) -> database.resetData())
                .show());
        page.addView(resetButton);
        page.addView(Ui.navigation(this, "Settings"));
        setContentView(page);
    }
}