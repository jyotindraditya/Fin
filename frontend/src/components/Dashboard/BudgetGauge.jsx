import ReactECharts from 'echarts-for-react';
import { formatCurrency } from '../../utils/formatters';

export default function BudgetGauge({ percentage, spent, budget, currency }) {
  const clamped = Math.min(percentage, 100);
  const gaugeColor = clamped < 60 ? '#10b981' : clamped < 85 ? '#f59e0b' : '#ef4444';

  const option = {
    series: [
      {
        type: 'gauge',
        startAngle: 220,
        endAngle: -40,
        min: 0,
        max: 100,
        splitNumber: 5,
        pointer: { show: false },
        progress: {
          show: true,
          width: 22,
          roundCap: true,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: gaugeColor },
                { offset: 1, color: gaugeColor + 'cc' },
              ],
            },
          },
        },
        axisLine: {
          lineStyle: { width: 22, color: [[1, 'rgba(255,255,255,0.06)']] },
          roundCap: true,
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        title: { show: false },
        detail: {
          valueAnimation: true,
          fontSize: 32,
          fontWeight: 700,
          color: gaugeColor,
          formatter: `${clamped.toFixed(0)}%`,
          offsetCenter: [0, '-5%'],
        },
        data: [{ value: clamped }],
      },
    ],
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <ReactECharts option={option} style={{ height: 260 }} />
      <div style={{ marginTop: -20, display: 'flex', justifyContent: 'center', gap: 40 }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: 4 }}>SPENT</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: gaugeColor }}>
            {formatCurrency(spent, currency)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: 4 }}>BUDGET</div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#9ca3af' }}>
            {formatCurrency(budget, currency)}
          </div>
        </div>
      </div>
    </div>
  );
}
