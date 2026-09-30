package za.ac.richfield.smartpantry;

import android.app.Activity;
import android.graphics.Color;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

public class PantryAdapter extends RecyclerView.Adapter<PantryAdapter.ItemViewHolder> {
    public interface Listener {
        void onEdit(PantryItem item);
        void onDelete(PantryItem item);
    }

    private final Activity activity;
    private final Listener listener;
    private final List<PantryItem> items = new ArrayList<>();

    public PantryAdapter(Activity activity, Listener listener) {
        this.activity = activity;
        this.listener = listener;
    }

    public void setItems(List<PantryItem> newItems) {
        items.clear();
        items.addAll(newItems);
        notifyDataSetChanged();
    }

    @Override
    public ItemViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        LinearLayout row = new LinearLayout(activity);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.CENTER_VERTICAL);
        row.setPadding(Ui.dp(activity, 16), Ui.dp(activity, 12), Ui.dp(activity, 16), Ui.dp(activity, 12));
        row.setBackgroundColor(Color.WHITE);

        RecyclerView.LayoutParams rowParams = new RecyclerView.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        rowParams.setMargins(0, Ui.dp(activity, 6), 0, Ui.dp(activity, 6));
        row.setLayoutParams(rowParams);

        TextView details = Ui.text(activity, "", 15);
        LinearLayout.LayoutParams textParams = new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1.0f);
        details.setLayoutParams(textParams);
        row.addView(details);

        LinearLayout buttonsLayout = new LinearLayout(activity);
        buttonsLayout.setOrientation(LinearLayout.HORIZONTAL);
        buttonsLayout.setGravity(Gravity.CENTER_VERTICAL);

        Button edit = new Button(activity);
        edit.setText("Edit");
        edit.setAllCaps(false);
        edit.setTextSize(13);
        LinearLayout.LayoutParams editParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        editParams.setMargins(Ui.dp(activity, 4), 0, Ui.dp(activity, 4), 0);
        edit.setLayoutParams(editParams);
        buttonsLayout.addView(edit);

        Button delete = new Button(activity);
        delete.setText("Delete");
        delete.setAllCaps(false);
        delete.setTextSize(13);
        LinearLayout.LayoutParams deleteParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        deleteParams.setMargins(Ui.dp(activity, 4), 0, 0, 0);
        delete.setLayoutParams(deleteParams);
        buttonsLayout.addView(delete);

        row.addView(buttonsLayout);

        return new ItemViewHolder(row, details, edit, delete);
    }

    @Override
    public void onBindViewHolder(ItemViewHolder holder, int position) {
        PantryItem item = items.get(position);
        holder.details.setText(item.getName() + "\n" + item.getQuantity() + " " + item.getUnit());
        holder.edit.setOnClickListener(view -> listener.onEdit(item));
        holder.delete.setOnClickListener(view -> listener.onDelete(item));
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    static class ItemViewHolder extends RecyclerView.ViewHolder {
        final TextView details;
        final Button edit;
        final Button delete;

        ItemViewHolder(View view, TextView details, Button edit, Button delete) {
            super(view);
            this.details = details;
            this.edit = edit;
            this.delete = delete;
        }
    }
}
