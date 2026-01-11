/**
 * SubVeille - Backend Server
 * API pour les fonctionnalites IA (OpenAI)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 3010;

// Middleware
app.use(cors({
  origin: ['http://localhost:8010', 'http://127.0.0.1:8010', 'http://localhost:5500'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes IA
app.use('/api/ai', aiRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    error: 'Erreur serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
  ========================================
  SubVeille API Server
  ========================================
  Port: ${PORT}
  OpenAI: ${process.env.OPENAI_API_KEY ? 'Configure' : 'NON CONFIGURE'}
  ========================================
  `);
});
