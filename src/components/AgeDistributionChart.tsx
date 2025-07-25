"use client";

import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { getAgeDistribution } from '@/utils/ageUtils';
import { getAllUsers } from '@/lib/storage-service';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Define chart colors
const chartColors = [
  'rgba(255, 99, 132, 0.8)',   // Pink
  'rgba(54, 162, 235, 0.8)',   // Blue
  'rgba(255, 206, 86, 0.8)',   // Yellow
  'rgba(75, 192, 192, 0.8)',   // Teal
  'rgba(153, 102, 255, 0.8)',  // Purple
  'rgba(255, 159, 64, 0.8)',   // Orange
];

const chartBorderColors = [
  'rgba(255, 99, 132, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(255, 206, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(255, 159, 64, 1)',
];

interface AgeDistributionChartProps {
  title?: string;
  className?: string;
}

export default function AgeDistributionChart({ title = "Distribuição de Idade dos Clientes", className = "" }: AgeDistributionChartProps) {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  }>({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user data and calculate age distribution
    const loadData = () => {
      try {
        setLoading(true);
        
        // Get all users from storage service
        const users = getAllUsers();
        
        // Filter only clients (not professionals)
        const clients = users.filter(user => user.type === 'client');
        
        // Calculate age distribution
        const ageDistribution = getAgeDistribution(clients);
        
        // Prepare chart data
        const labels = Object.keys(ageDistribution);
        const data = Object.values(ageDistribution);
        
        setChartData({
          labels,
          datasets: [
            {
              data,
              backgroundColor: chartColors.slice(0, labels.length),
              borderColor: chartBorderColors.slice(0, labels.length),
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error loading age distribution data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            size: 12,
          },
          padding: 20,
        },
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
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : chartData.datasets[0].data.every(value => value === 0) ? (
        <div className="flex justify-center items-center h-64 text-gray-500 dark:text-gray-400">
          <p>Sem dados suficientes para exibir o gráfico</p>
        </div>
      ) : (
        <div className="h-64">
          <Pie data={chartData} options={options} />
        </div>
      )}
    </div>
  );
}
