import { useState } from 'react';
import { useToast } from '../common/Toast';
import { expenseService } from '../../services/expenseService';
import { formatDateInput } from '../../utils/formatters';

export default function ExpenseForm({ expense, categories, onClose, onSaved }) {
  const isEdit = !!expense;
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    amount: expense?.amount || '',
    description: expense?.description || '',
    date: formatDateInput(expense?.date) || new Date().toISOString().split('T')[0],
    categoryId: expense?.category?.id || (categories[0]?.id || ''),
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        amount: Number(form.amount),
        description: form.description,
        date: form.date,
        categoryId: Number(form.categoryId),
      };
      if (isEdit) {
        await expenseService.update(expense.id, payload);
        toast('Expense updated');
      } else {
        await expenseService.create(payload);
        toast('Expense added');
      }
      onSaved();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{isEdit ? 'Edit Expense' : 'Add Expense'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount</label>
              <input
                type="number" name="amount" step="0.01" min="0.01"
                className="form-input" placeholder="0.00"
                value={form.amount} onChange={handleChange} required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date" name="date" className="form-input"
                value={form.date} onChange={handleChange} required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select name="categoryId" className="form-select" value={form.categoryId} onChange={handleChange} required>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text" name="description" className="form-input"
              placeholder="What was this expense for?"
              value={form.description} onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : isEdit ? 'Update' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
