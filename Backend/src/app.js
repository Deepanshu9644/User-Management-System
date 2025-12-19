const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const usersRoutes = require('./routes/users.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'OK' });
});

app.use('/api/users', usersRoutes);

// JSON-only 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    errors: []
  });
});

app.use(errorHandler);

module.exports = app;
