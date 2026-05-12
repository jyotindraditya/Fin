import api from './api';

export const analyticsService = {
  getPieChart: (month, year) =>
    api.get('/analytics/pie-chart', { params: { month, year } }),
};
