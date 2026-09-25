const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const { authLimiter } = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');
const AppError = require('./utils/errors/AppError');

const app = express();

app.set('trust proxy', 1); // Render/Netlify sit behind a reverse proxy

// ---------------------------------------------------------------------------
// CORS — allow a comma-separated list of origins via CLIENT_URL
// (e.g. "https://assetflow.netlify.app,https://main--assetflow.netlify.app")
// ---------------------------------------------------------------------------
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser requests (curl, health checks) and any configured origin
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(new AppError(`Origin ${origin} not allowed by CORS`, 403));
  },
  credentials: true,
};

// Security middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(mongoSanitize());
app.use(hpp());

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AssetFlow API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/v1', routes);

// 404 handler
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(errorHandler);

module.exports = app;
