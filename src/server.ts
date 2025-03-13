import express from 'express';
import logger from './logger.js';
import prometheus from 'prom-client';


const app = express();
const PORT = process.env.PORT || 3000;

const registry = new prometheus.Registry();
prometheus.collectDefaultMetrics({ register: registry });

const smsCounter = new prometheus.Counter({
  name: 'sms_sent_total',
  help: 'Total number of SMS sent',
  labelNames: ['status', 'brand']
});

registry.registerMetric(smsCounter);

export const metrics = {
  smsCounter
};

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', registry.contentType);
  res.end(await registry.metrics());
});

app.listen(PORT, () => {
  logger.info(`Health check server listening on port ${PORT}`);
});

export default app;