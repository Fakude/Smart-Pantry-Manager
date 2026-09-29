import React, { useState, useEffect } from 'react';
import { PantryItem } from '../../types';
import { ArrowLeft, Calendar, AlertCircle } from 'lucide-react';

interface AddEditScreenProps {
  itemToEdit?: PantryItem | null;
  onSave: (item: Omit<PantryItem, 'id' | 'addedAt'> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  onCancel: () => void;
}

export const AddEditScreen: React.FC<AddEditScreenProps> = ({
  itemToEdit,
  onSave,
  onDelete,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('g');
  const [category, setCategory] = useState<PantryItem['category']>('Produce');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');

  // Validation errors state
  const [errors, setErrors] = useState<{ name?: string; quantity?: string }>({});

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setQuantity(String(itemToEdit.quantity));
      setUnit(itemToEdit.unit);
      setCategory(itemToEdit.category);
      setExpiryDate(itemToEdit.expiryDate || '');
      setNotes(itemToEdit.notes || '');
    } else {
      setName('');
      setQuantity('1');
      setUnit('pcs');
      setCategory('Produce');
      setExpiryDate('');
      setNotes('');
    }
    setErrors({});
  }, [itemToEdit]);

  const units = ['g', 'kg', 'ml', 'L', 'pcs', 'cloves', 'slices', 'cans', 'tbsp', 'cups'];
  const categories: PantryItem['category'][] = [
    'Produce',
    'Dairy & Eggs',
    'Pantry Staples',
    'Meat & Seafood',
    'Bakery',
    'Condiments & Spices',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; quantity?: string } = {};

    // Validate Name
    if (!name.trim()) {
      newErrors.name = 'Ingredient name is required';
    }

    // Validate Quantity
    const numQty = parseFloat(quantity);
    if (!quantity.trim() || isNaN(numQty)) {
      newErrors.quantity = 'Valid numeric quantity is required';
    } else if (numQty <= 0) {
      newErrors.quantity = 'Quantity must be greater than zero';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...(itemToEdit ? { id: itemToEdit.id } : {}),
      name: name.trim(),
      quantity: numQty,
      unit,
      category,
      expiryDate: expiryDate || undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Top App Bar with Up Navigation */}
      <div className="bg-blue-900 text-white px-4 py-3 shadow-md flex items-center gap-3 shrink-0">
        <button
          onClick={onCancel}
          className="p-1 rounded-full hover:bg-blue-800 transition-colors"
          title="Back to pantry"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-semibold">
            {itemToEdit ? 'Edit Ingredient' : 'Add Leftover Item'}
          </h1>
          <p className="text-[10px] text-blue-200">Input validation active</p>
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Ingredient Name Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Ingredient Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Tomatoes, Eggs, Pasta..."
            value={name}
            onChange={e => {
              setName(e.target.value);
              if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
            }}
            className={`w-full px-3 py-2 text-xs text-slate-900 bg-white border rounded shadow-xs outline-none transition-colors ${
              errors.name
                ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
            }`}
          />
          {errors.name && (
            <p className="flex items-center gap-1 text-[11px] text-red-600 mt-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Quantity & Unit Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 500, 2, 0.5"
              value={quantity}
              onChange={e => {
                setQuantity(e.target.value);
                if (errors.quantity) setErrors(prev => ({ ...prev, quantity: undefined }));
              }}
              className={`w-full px-3 py-2 text-xs text-slate-900 bg-white border rounded shadow-xs outline-none transition-colors ${
                errors.quantity
                  ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
              }`}
            />
            {errors.quantity && (
              <p className="flex items-center gap-1 text-[11px] text-red-600 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.quantity}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Unit</label>
            <select
              value={unit}
              onChange={e => setUnit(e.target.value)}
              className="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded shadow-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            >
              {units.map(u => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value as PantryItem['category'])}
            className="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded shadow-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Expiry Date Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Expiry Date <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <input
              type="date"
              value={expiryDate}
              onChange={e => setExpiryDate(e.target.value)}
              className="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded shadow-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Used to alert you before food spoils to minimize waste.
          </p>
        </div>

        {/* Notes Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Notes / Leftover Context <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Opened 2 days ago, store in airtight container..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-300 rounded shadow-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2">
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white font-medium text-xs rounded-lg shadow-sm transition-colors active:scale-[0.99]"
          >
            {itemToEdit ? 'Update Ingredient in SQLite' : 'Save Ingredient to SQLite'}
          </button>

          {itemToEdit && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(itemToEdit.id)}
              className="w-full py-2 px-4 bg-red-50 hover:bg-red-100 text-red-700 font-medium text-xs rounded-lg border border-red-200 transition-colors"
            >
              Delete from Pantry
            </button>
          )}

          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
