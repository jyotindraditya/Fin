import { DollarSign, TrendingUp, PiggyBank, Crown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function StatsCards({ totalSpent, budget, remaining, topCategory, currency }) {
  const stats = [
    {
      label: 'Total Spent',
      value: formatCurrency(totalSpent, currency),
      icon: DollarSign,
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.12)',
      accent: 'linear-gradient(135deg, #ef4444, #f43f5e)',
    },
    {
      label: 'Monthly Budget',
      value: formatCurrency(budget, currency),
      icon: PiggyBank,
      color: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.12)',
      accent: 'var(--gradient-primary)',
    },
    {
      label: 'Remaining',
      value: formatCurrency(Math.max(0, remaining), currency),
      icon: TrendingUp,
      color: remaining >= 0 ? '#10b981' : '#ef4444',
      bg: remaining >= 0 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
      accent: remaining >= 0 ? 'var(--gradient-success)' : 'var(--gradient-danger)',
    },
    {
      label: 'Top Category',
      value: topCategory,
      icon: Crown,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.12)',
      accent: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((s) => (
        <div className="card stat-card" key={s.label} style={{ '--stat-accent': s.accent }}>
          <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
