import ReactECharts from 'echarts-for-react';

export default function PieChart({ categories }) {
  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      borderColor: 'rgba(255,255,255,0.1)',
      textStyle: { color: '#f9fafb', fontSize: 13 },
      formatter: (p) => `${p.name}<br/><b>$${p.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</b> (${p.percent}%)`,
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { color: '#9ca3af', fontSize: 12 },
      icon: 'circle',
      itemWidth: 10,
      itemGap: 14,
    },
    series: [
      {
        type: 'pie',
        radius: ['42%', '72%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#0a0e1a',
          borderWidth: 3,
        },
        label: { show: false },
        emphasis: {
          scale: true,
          scaleSize: 8,
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(0,0,0,0.5)',
          },
        },
        data: categories.map((c) => ({
          name: c.name,
          value: Number(c.amount),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: c.color },
                { offset: 1, color: c.color + 'aa' },
              ],
            },
          },
        })),
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: (idx) => idx * 80,
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 320 }} />;
}
