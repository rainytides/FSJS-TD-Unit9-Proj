'use strict';

const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const { User } = require('../models');
const authenticateUser = require('./middleware/authenticateUser');
const asyncHandler = require('./middleware/asyncHandler');

// Helper function to handle route errors
function routeErrorHandler(error, res) {
    if (error.name === 'SequelizeValidationError') {
        // Handle validation errors from Sequelize
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });
    } else {
        // Throw the error to be caught by the global error handler
        throw error;
    }
}

// GET /api/users - Returns the currently authenticated user's information
router.get('/', authenticateUser, asyncHandler(async (req, res) => {
    // Retrieve the authenticated user's details, excluding sensitive information
    const user = await User.findByPk(req.currentUser.id, {
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    });
    res.status(200).json(user);
}));

// POST /api/users - Creates a new user account
router.post('/', asyncHandler(async (req, res) => {
    try {
        const user = req.body;
        // Hash the password if provided
        if (user.password) {
            user.password = bcryptjs.hashSync(user.password, 10);
        }

        // Create a new user
        await User.create(user);
        res.status(201).location('/').end();
    } catch (error) {
        // Handle unique constraint error for email address
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: 'The email address is already in use. Please use a different email address.' });
        } else {
            routeErrorHandler(error, res);
        }
    }
}));

// Export the router for use in the main application
module.exports = router;
