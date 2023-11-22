// Import necessary modules and middleware
const express = require('express');
const router = express.Router();
const { Course, User } = require('../models');
const authenticateUser = require('./middleware/authenticateUser');
const asyncHandler = require('./middleware/asyncHandler');

// Helper function to handle route errors
function routeErrorHandler(error, res) {
    if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });
    } else {
        throw error;
    }
}

// GET /api/courses - Returns a list of courses with the user that owns each course
router.get('/', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'emailAddress'] }]
    });
    res.status(200).json(courses.length ? courses : { message: 'No courses found' });
}));

// GET /api/courses/:id - Returns the course for the provided course ID including the owner
router.get('/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'emailAddress'] }]
    });
    res.status(200).json(course || { message: 'Course not found' });
}));

// POST /api/courses - Creates a course and sets the Location header to the new course URI
router.post('/', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).location(`/api/courses/${course.id}`).end();
    } catch (error) {
        routeErrorHandler(error, res);
    }
}));

// PUT /api/courses/:id - Updates a course if the current user is the owner
router.put('/:id', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (course && course.userId === req.currentUser.id) {
            await course.update(req.body);
            res.status(204).end();
        } else {
            res.status(course ? 403 : 404).json({ message: course ? 'You are not authorized to update this course' : 'Course not found' });
        }
    } catch (error) {
        routeErrorHandler(error, res);
    }
}));

// DELETE /api/courses/:id - Deletes a course if the current user is the owner
router.delete('/:id', authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (!course) {
        // If course does not exist, return 404 Not Found
        return res.status(404).json({ message: 'Course not found' });
    } 
    
    if (course.userId !== req.currentUser.id) {
        // If the current user is not the owner, return 403 Forbidden
        return res.status(403).json({ message: 'You are not authorized to delete this course' });
    }

    // If the user is authorized, delete the course
    await course.destroy();
    // Return 204 No Content on successful deletion
    res.status(204).end();
}));


// Export the router for use in the main app
module.exports = router;
