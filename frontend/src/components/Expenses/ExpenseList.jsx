import { useState, useEffect } from 'react';
import Header from '../Layout/Header';
import ExpenseForm from './ExpenseForm';
import ExpenseFilters from './ExpenseFilters';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { useToast } from '../common/Toast';
import { expenseService } from '../../services/expenseService';
import { categoryService } from '../../services/categoryService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Plus, Trash2, Edit3, Receipt } from 'lucide-react';

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [filters, setFilters] = useState({});
  const toast = useToast();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expRes, catRes] = await Promise.all([
        expenseService.getAll(filters),
        categoryService.getAll(),
      ]);
      setExpenses(expRes.data);
      setCategories(catRes.data);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (newFilters) => {
    setFilters(newFilters);
    try {
      const res = await expenseService.getAll(newFilters);
      setExpenses(res.data);
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const confirmDelete = async () => {
    if (!expenseToDelete) return;
    try {
      await expenseService.delete(expenseToDelete.id);
      setExpenses((prev) => prev.filter((e) => e.id !== expenseToDelete.id));
      toast('Expense deleted');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setExpenseToDelete(null);
    }
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditingExpense(null);
    fetchData();
  };

  return (
    <>
      <Header title="Expenses" subtitle={`${expenses.length} transaction${expenses.length !== 1 ? 's' : ''}`}>
        <button className="btn btn-primary" onClick={() => { setEditingExpense(null); setShowForm(true); }}>
          <Plus size={18} /> Add Expense
        </button>
      </Header>

      <div className="page-content">
        <ExpenseFilters categories={categories} onFilter={handleFilter} />

        {loading ? (
          <LoadingSpinner />
        ) : expenses.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No expenses found"
            text="Start tracking your spending by adding your first expense."
            action={
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                <Plus size={18} /> Add Expense
              </button>
            }
          />
        ) : (
          <div className="card">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((e) => (
                    <tr key={e.id}>
                      <td>{formatDate(e.date)}</td>
                      <td>{e.description || '—'}</td>
                      <td>
                        <span className="category-badge">
                          <span className="category-dot" style={{ background: e.category?.color }} />
                          {e.category?.name}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(e.amount)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button className="btn-icon" onClick={() => { setEditingExpense(e); setShowForm(true); }}>
                            <Edit3 size={15} />
                          </button>
                          <button className="btn-icon" onClick={() => setExpenseToDelete(e)} style={{ color: '#ef4444' }}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          categories={categories}
          onClose={() => { setShowForm(false); setEditingExpense(null); }}
          onSaved={handleSaved}
        />
      )}

      {expenseToDelete && (
        <div className="modal-overlay" onClick={() => setExpenseToDelete(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <h2 className="modal-title">Delete Expense</h2>
            <p style={{ marginBottom: '24px' }}>
              Are you sure you want to delete this expense? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setExpenseToDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
