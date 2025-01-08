import React, { useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  registerables,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ...registerables
);

const SalesChart = () => {
  useEffect(() => {
    return () => {
      Object.values(ChartJS.instances).forEach((instance) => {
        if (instance) {
          instance.destroy();
        }
      });
    };
  }, []);

  const data = {
    labels: [
      "0",
      "0.1",
      "0.2",
      "0.3",
      "0.4",
      "0.5",
      "0.6",
      "0.7",
      "0.8",
      "0.9",
      "1.0",
    ],
    datasets: [
      {
        label: "Thống kê bán hàng",
        data: Array(11).fill(0),
        borderColor: "rgba(0,0,0,0)",
        pointRadius: 0,
        borderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Thống kê bán hàng",
        font: {
          size: 18,
          weight: "bold",
        },
        align: "start",
        color: "#555",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "#d3d3d3",
        },
        ticks: {
          stepSize: 0.1,
          color: "#888",
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "400px",
        height: "300px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        padding: "20px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Line data={data} options={options} />
    </div>
  );
};

export default SalesChart;
