import { useState, useEffect } from 'react';
import Header from '../Layout/Header';
import StatsCards from './StatsCards';
import PieChart from './PieChart';
import BudgetGauge from './BudgetGauge';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { analyticsService } from '../../services/analyticsService';
import { settingsService } from '../../services/settingsService';
import { BarChart3 } from 'lucide-react';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const now = new Date();
  const [month] = useState(now.getMonth() + 1);
  const [year] = useState(now.getFullYear());

  useEffect(() => {
    fetchData();
  }, [month, year]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, settingsRes] = await Promise.all([
        analyticsService.getPieChart(month, year),
        settingsService.get(),
      ]);
      setAnalytics(analyticsRes.data);
      setSettings(settingsRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <><Header title="Dashboard" /><div className="page-content"><LoadingSpinner /></div></>;
  if (error) return <><Header title="Dashboard" /><div className="page-content"><EmptyState title="Connection Error" text={error} /></div></>;

  const { categories, totalSpent, monthlyBudget, budgetUsagePercent } = analytics || {};
  const remaining = (monthlyBudget || 0) - (totalSpent || 0);
  const topCategory = categories?.length > 0 ? categories[0].name : 'None';

  return (
    <>
      <Header title="Dashboard" subtitle={`${new Date(year, month - 1).toLocaleString('en-US', { month: 'long' })} ${year}`} />
      <div className="page-content">
        <StatsCards
          totalSpent={totalSpent || 0}
          budget={monthlyBudget || 0}
          remaining={remaining}
          topCategory={topCategory}
          currency={settings?.currency || 'USD'}
        />

        {categories?.length > 0 ? (
          <div className="charts-grid">
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Spending by Category</div>
                  <div className="card-subtitle">This month's breakdown</div>
                </div>
              </div>
              <PieChart categories={categories} currency={settings?.currency || 'USD'} />
            </div>
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Budget Usage</div>
                  <div className="card-subtitle">{budgetUsagePercent?.toFixed(1)}% of budget used</div>
                </div>
              </div>
              <BudgetGauge percentage={budgetUsagePercent || 0} spent={totalSpent || 0} budget={monthlyBudget || 0} currency={settings?.currency || 'USD'} />
            </div>
          </div>
        ) : (
          <EmptyState
            icon={BarChart3}
            title="No expenses yet"
            text="Start tracking your spending to see analytics here."
          />
        )}
      </div>
    </>
  );
}
