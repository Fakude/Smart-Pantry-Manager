package za.ac.richfield.smartpantry;

public class PantryItem {
    private long id;
    private String name;
    private double quantity;
    private String unit;
    private String category;
    private String expiryDate;

    public PantryItem(long id, String name, double quantity, String unit, String category, String expiryDate) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.category = category;
        this.expiryDate = expiryDate;
    }

    public long getId() { return id; }
    public String getName() { return name; }
    public double getQuantity() { return quantity; }
    public String getUnit() { return unit; }
    public String getCategory() { return category; }
    public String getExpiryDate() { return expiryDate; }

    public void setId(long id) { this.id = id; }
}