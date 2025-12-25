import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config';
import { connectDB } from './config/database';
import tradeRoutes from './routes/tradeRoutes';

const app = express();

// Connect to MongoDB
connectDB();

// Logging middleware - FIRST
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl} origin=${req.headers.origin}`);
  next();
});

// CORS middleware - SECOND (before body parsers)
const allowedOrigins = [
  'https://trade-journal-alpha.vercel.app',
  'https://journla2-production.up.railway.app'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  
  next();
});

// Body parsers - THIRD
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check - BEFORE other routes for debugging
app.get('/api/health', (req, res) => {
  console.log('Health check hit');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/trades', tradeRoutes);

// Catch-all for debugging 404s
app.use((req, res) => {
  console.log(`[404] ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

// Start server
const port = process.env.PORT || config.port || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});