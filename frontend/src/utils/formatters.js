import { CURRENCY_SYMBOLS } from './constants';

export function formatCurrency(amount, currency = 'USD') {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  return `${symbol}${Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export function formatDateInput(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

export function getMonthName(month) {
  return new Date(2000, month - 1).toLocaleString('en-US', { month: 'long' });
}
