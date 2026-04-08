import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface MetricData {
  timestamp: string;
  activeUsers: number;
  revenue: number;
  errorRate: number;
}

const Dashboard: React.FC = () => {
  const { data, isLoading } = useQuery<MetricData[]>({
    queryKey: ['metrics'],
    queryFn: async () => {
      const response = await fetch('/api/metrics');
      return response.json();
    },
    refetchInterval: 30000
  });

  if (isLoading) return <div>Loading metrics...</div>;

  return (
    <div className="dashboard">
      <h2>SaaS Metrics Dashboard</h2>
      <div className="chart-container">
        <h3>Active Users</h3>
        <LineChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="activeUsers" stroke="#8884d8" />
        </LineChart>
      </div>
      <div className="chart-container">
        <h3>Revenue</h3>
        <LineChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
        </LineChart>
      </div>
    </div>
  );
};

export default Dashboard;
