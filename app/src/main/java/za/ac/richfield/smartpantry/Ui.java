package za.ac.richfield.smartpantry;

import android.app.Activity;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.view.Gravity;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

public class Ui {
    public static final int GREEN = Color.rgb(37, 109, 90);
    public static final int DARK = Color.rgb(35, 44, 40);
    public static final int MUTED = Color.rgb(95, 105, 100);

    public static LinearLayout page(Activity activity, String title) {
        LinearLayout layout = new LinearLayout(activity);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setPadding(dp(activity, 16), dp(activity, 16), dp(activity, 16), dp(activity, 8));
        layout.setBackgroundColor(Color.rgb(247, 249, 247));

        TextView heading = new TextView(activity);
        heading.setText(title);
        heading.setTextSize(24);
        heading.setTextColor(DARK);
        heading.setPadding(0, 0, 0, dp(activity, 12));
        layout.addView(heading);
        return layout;
    }

    public static Button button(Activity activity, String label) {
        Button button = new Button(activity);
        button.setText(label);
        button.setAllCaps(false);
        button.setTextColor(Color.WHITE);
        button.setBackgroundTintList(ColorStateList.valueOf(GREEN));
        return button;
    }

    public static TextView text(Activity activity, String value, int size) {
        TextView text = new TextView(activity);
        text.setText(value);
        text.setTextSize(size);
        text.setTextColor(DARK);
        return text;
    }

    public static LinearLayout navigation(Activity activity, String selected) {
        LinearLayout bar = new LinearLayout(activity);
        bar.setGravity(Gravity.CENTER);
        bar.setBackgroundColor(Color.WHITE);
        String[] labels = {"Pantry", "Recipes", "Settings"};
        Class<?>[] screens = {MainActivity.class, SuggestedRecipesActivity.class, SettingsActivity.class};

        for (int i = 0; i < labels.length; i++) {
            String label = labels[i];
            Class<?> screen = screens[i];
            Button button = new Button(activity);
            button.setText(label);
            button.setAllCaps(false);
            button.setTextColor(label.equals(selected) ? GREEN : MUTED);
            button.setLayoutParams(new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1));
            button.setOnClickListener(view -> {
                if (!label.equals(selected)) activity.startActivity(new Intent(activity, screen));
            });
            bar.addView(button);
        }
        return bar;
    }

    public static int dp(Activity activity, int value) {
        return (int) (value * activity.getResources().getDisplayMetrics().density + 0.5f);
    }
}
