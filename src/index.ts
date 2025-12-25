import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config';
import { connectDB } from './config/database';
import tradeRoutes from './routes/tradeRoutes';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  'https://trade-journal-alpha.vercel.app',
  'https://journla2-production.up.railway.app'
];

app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl} origin=${req.headers.origin}`);
  next();
});

// place before your routes
app.use((req, res, next) => {
  const allowed = [
    'https://trade-journal-alpha.vercel.app',
    'https://trade-journal-alpha.vercel.app/',
    'https://journla2-production.up.railway.app'
  ];
  const origin = req.headers.origin as string | undefined;

  if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});
// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/trades', tradeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const port = process.env.PORT || config.port || 5000;
app.listen(port, ()=> console.log(`Server listening on ${port}`));
