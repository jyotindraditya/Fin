import { useState } from 'react';
import { Filter } from 'lucide-react';

export default function ExpenseFilters({ categories, onFilter }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const apply = () => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (categoryId) params.categoryId = categoryId;
    onFilter(params);
  };

  const clear = () => {
    setStartDate('');
    setEndDate('');
    setCategoryId('');
    onFilter({});
  };

  return (
    <div className="filter-bar">
      <Filter size={18} style={{ color: 'var(--text-muted)' }} />
      <input type="date" className="form-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="From" />
      <input type="date" className="form-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="To" />
      <select className="form-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
        <option value="">All Categories</option>
        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <button className="btn btn-primary btn-sm" onClick={apply}>Apply</button>
      <button className="btn btn-secondary btn-sm" onClick={clear}>Clear</button>
    </div>
  );
}
