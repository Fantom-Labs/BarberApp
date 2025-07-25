"use client";

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { getClientStatistics, clientSegments } from '@/lib/client-analytics';

// Registrar os componentes necessários do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

export default function ClientSegmentPieChart() {
  const stats = getClientStatistics();
  
  // Preparar dados para o gráfico
  const segmentData = Object.entries(stats.segmentDistribution)
    .sort((a, b) => b[1] - a[1]); // Ordenar por quantidade (maior primeiro)
  
  const labels = segmentData.map(([segment]) => segment);
  const data = segmentData.map(([, count]) => count);
  
  // Obter cores dos segmentos
  const colors = segmentData.map(([segment]) => {
    const segmentDef = clientSegments.find(s => s.name === segment);
    if (!segmentDef) return 'rgba(200, 200, 200, 0.7)';
    
    // Extrair a cor do segmento
    const colorClass = segmentDef.color;
    
    // Mapear classes de cores para valores RGBA
    if (colorClass.includes('green')) return 'rgba(34, 197, 94, 0.7)';
    if (colorClass.includes('blue')) return 'rgba(59, 130, 246, 0.7)';
    if (colorClass.includes('red')) return 'rgba(239, 68, 68, 0.7)';
    if (colorClass.includes('yellow')) return 'rgba(234, 179, 8, 0.7)';
    if (colorClass.includes('purple')) return 'rgba(168, 85, 247, 0.7)';
    if (colorClass.includes('indigo')) return 'rgba(99, 102, 241, 0.7)';
    if (colorClass.includes('gray')) return 'rgba(107, 114, 128, 0.7)';
    
    return 'rgba(200, 200, 200, 0.7)';
  });
  
  const borderColors = colors.map(color => color.replace('0.7', '1'));
  
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        align: 'start' as const,
        labels: {
          boxWidth: 10,
          padding: 8,
          font: {
            size: 9
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };
  
  return (
    <div className="h-48 flex items-center justify-center">
      {data.length === 0 ? (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Sem dados suficientes para exibir o gráfico
        </div>
      ) : (
        <Pie data={chartData} options={options} />
      )}
    </div>
  );
}
