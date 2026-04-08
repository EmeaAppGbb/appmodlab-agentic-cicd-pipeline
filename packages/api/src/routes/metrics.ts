import { Hono } from 'hono';

const app = new Hono();

app.get('/', async (c) => {
  const metrics = [
    { timestamp: '2024-01-01T00:00:00Z', activeUsers: 1250, revenue: 45000, errorRate: 0.02 },
    { timestamp: '2024-01-02T00:00:00Z', activeUsers: 1340, revenue: 48000, errorRate: 0.015 },
    { timestamp: '2024-01-03T00:00:00Z', activeUsers: 1420, revenue: 52000, errorRate: 0.01 },
    { timestamp: '2024-01-04T00:00:00Z', activeUsers: 1380, revenue: 49500, errorRate: 0.018 },
    { timestamp: '2024-01-05T00:00:00Z', activeUsers: 1500, revenue: 55000, errorRate: 0.012 }
  ];
  
  return c.json(metrics);
});

app.get('/realtime', async (c) => {
  return c.json({
    activeUsers: Math.floor(Math.random() * 2000) + 1000,
    revenue: Math.floor(Math.random() * 20000) + 40000,
    errorRate: Math.random() * 0.05
  });
});

export default app;
