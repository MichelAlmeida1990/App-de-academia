// src/components/charts/ProgressChart.js (novo componente)
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProgressChart = ({ data }) => {
  const chartData = {
    labels: data.labels, // Ex: ['Jan', 'Fev', 'Mar', 'Abr']
    datasets: [
      {
        label: 'Peso (kg)',
        data: data.weight, // Ex: [70, 69, 68, 67.5]
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
      },
      // Adicione outros datasets conforme necessário (ex: calorias, volume)
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Evolução do Peso ao Longo do Tempo',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default ProgressChart;