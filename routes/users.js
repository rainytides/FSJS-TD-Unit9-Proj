// Setup the /api/users routes
const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const { Course, User } = require('../models');
const authenticateUser = require('./middleware/authenticateUser');
const asyncHandler = require('./middleware/asyncHandler');

// GET /api/users 200 - Returns the currently authenticated user
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const userId = req.currentUser.dataValues.id;
    const user = await User.findByPk(userId, {
        attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
        exclude: ['password', 'createdAt', 'updatedAt']
    });
    res.status(200).json(user);
}));

// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/users', asyncHandler(async (req, res) => {
    const user = req.body;

    if (user.password) {
        user.password = bcryptjs.hashSync(user.password);
    };

    try {
        await User.create(user);
        res.status(201).location('/').end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        };
    };
}));

module.exports = router;

