import { useState, useEffect } from 'react';
import Header from '../Layout/Header';
import CategoryForm from './CategoryForm';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { useToast } from '../common/Toast';
import { categoryService } from '../../services/categoryService';
import { Plus, Trash2, Edit3, Tag } from 'lucide-react';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const toast = useToast();

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getAll();
      setCategories(res.data);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await categoryService.delete(categoryToDelete.id);
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      toast('Category deleted');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setCategoryToDelete(null);
    }
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditing(null);
    fetchCategories();
  };

  return (
    <>
      <Header title="Categories" subtitle={`${categories.length} categories`}>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus size={18} /> Add Category
        </button>
      </Header>

      <div className="page-content">
        {loading ? (
          <LoadingSpinner />
        ) : categories.length === 0 ? (
          <EmptyState icon={Tag} title="No categories" text="Create categories to organize expenses." />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {categories.map((c) => (
              <div className="card" key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-md)',
                  background: c.color, flexShrink: 0,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn-icon" onClick={() => { setEditing(c); setShowForm(true); }}>
                    <Edit3 size={15} />
                  </button>
                  <button className="btn-icon" onClick={() => setCategoryToDelete(c)} style={{ color: '#ef4444' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <CategoryForm
          category={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={handleSaved}
        />
      )}

      {categoryToDelete && (
        <div className="modal-overlay" onClick={() => setCategoryToDelete(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <h2 className="modal-title">Delete Category</h2>
            <p style={{ marginBottom: '24px' }}>
              Are you sure you want to delete the "{categoryToDelete.name}" category?
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setCategoryToDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
