import { useState, useEffect } from 'react';
import Header from '../Layout/Header';
import LoadingSpinner from '../common/LoadingSpinner';
import { useToast } from '../common/Toast';
import { settingsService } from '../../services/settingsService';
import { Save } from 'lucide-react';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD'];

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    settingsService.get()
      .then((res) => setSettings(res.data))
      .catch((err) => toast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await settingsService.update({
        monthlyBudget: Number(settings.monthlyBudget),
        currency: settings.currency,
        resetDay: Number(settings.resetDay),
      });
      setSettings(res.data);
      toast('Settings saved');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <><Header title="Settings" /><div className="page-content"><LoadingSpinner /></div></>;

  return (
    <>
      <Header title="Settings" subtitle="Configure your budget and preferences" />
      <div className="page-content">
        <div className="card" style={{ maxWidth: 520 }}>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Monthly Budget</label>
              <input
                type="number" className="form-input" step="0.01" min="0"
                placeholder="2000.00"
                value={settings?.monthlyBudget || ''}
                onChange={(e) => setSettings({ ...settings, monthlyBudget: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Currency</label>
              <select
                className="form-select"
                value={settings?.currency || 'USD'}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              >
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Budget Reset Day</label>
              <select
                className="form-select"
                value={settings?.resetDay || 1}
                onChange={(e) => setSettings({ ...settings, resetDay: e.target.value })}
              >
                {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {d === 1 ? '1st' : d === 2 ? '2nd' : d === 3 ? '3rd' : `${d}th`} of each month
                  </option>
                ))}
              </select>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>
                Your monthly budget cycle resets on this day.
              </p>
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
