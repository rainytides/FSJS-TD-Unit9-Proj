'use strict';

// Load modules
const express = require('express');
const morgan = require('morgan');

// Import route modules
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');

// Variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// Create the Express app
const app = express();

// Setup request body JSON parsing
app.use(express.json());

// Setup morgan for HTTP request logging
app.use(morgan('dev'));

// Setup the API routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

// Setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.send('Welcome to the REST API project!');
});

// Add a 404 handler for when a route is not found
app.use((req, res, next) => {
  const err = new Error('Route Not Found');
  err.status = 404;
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${err.stack}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// Set the server port
app.set('port', process.env.PORT || 5000);

// Start listening on the port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

module.exports = app; // Export the app for testing purposes
