import { Hono } from 'hono';

const app = new Hono();

app.get('/invoices', async (c) => {
  return c.json([
    { id: 1, customerId: 'cust_123', amount: 9900, status: 'paid' },
    { id: 2, customerId: 'cust_456', amount: 19900, status: 'pending' }
  ]);
});

app.post('/charge', async (c) => {
  const body = await c.req.json();
  return c.json({ 
    success: true, 
    chargeId: 'ch_' + Math.random().toString(36).substr(2, 9),
    amount: body.amount 
  });
});

export default app;
