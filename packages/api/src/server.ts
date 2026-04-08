import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import metricsRoutes from './routes/metrics';
import billingRoutes from './routes/billing';
import healthRoutes from './routes/health';

const app = new Hono();

app.use('/*', cors());

app.route('/api/metrics', metricsRoutes);
app.route('/api/billing', billingRoutes);
app.route('/api/health', healthRoutes);

const port = parseInt(process.env.PORT || '3000');

console.log(`Server starting on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
