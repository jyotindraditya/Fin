import { useState } from 'react';
import { useToast } from '../common/Toast';
import { categoryService } from '../../services/categoryService';
import { COLORS } from '../../utils/constants';

export default function CategoryForm({ category, onClose, onSaved }) {
  const isEdit = !!category;
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: category?.name || '',
    color: category?.color || COLORS[0],
    icon: category?.icon || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (isEdit) {
        await categoryService.update(category.id, form);
        toast('Category updated');
      } else {
        await categoryService.create(form);
        toast('Category created');
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
        <h2 className="modal-title">{isEdit ? 'Edit Category' : 'New Category'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text" className="form-input" placeholder="e.g. Groceries"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              required maxLength={100}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Color</label>
            <div className="color-grid">
              {COLORS.map((c) => (
                <div
                  key={c}
                  className={`color-swatch${form.color === c ? ' selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => setForm({ ...form, color: c })}
                />
              ))}
            </div>
          </div>



          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
