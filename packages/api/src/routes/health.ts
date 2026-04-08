import { Hono } from 'hono';

const app = new Hono();

app.get('/', async (c) => {
  return c.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/ready', async (c) => {
  return c.json({ ready: true });
});

export default app;
