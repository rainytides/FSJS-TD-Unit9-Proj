// Set up routes for courses
const express = require('express');
const router = express.Router();
const { Course, User } = require('../models');
const authenticateUser = require('./middleware/authenticateUser');
const asyncHandler = require('./middleware/asyncHandler');

// GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
router.get('/', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
        exclude: ['createdAt', 'updatedAt'],
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'firstName', 'lastName', 'emailAddress']
            }
        ]
    });

    if (courses) {
        res.status(200).json(courses);
    } else {
        res.status(404).json({ message: 'No courses found' });
    };

}));

// GET /api/courses/:id 200 - Returns a the course (including the user that owns the course) for the provided course ID
router.get('/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
        attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'firstName', 'lastName', 'emailAddress']
            }
        ]
    });

    // If course exists, return course
    if (course) {
        res.status(200).json(course);
    } else {
        res.status(404).json({ message: 'Course not found' });
    };

}));

// POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
router.post('/', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).location(`/api/courses/${course.id}`).end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        };
    };
}));

// PUT /api/courses/:id 204 - Updates a course and returns no content
router.put('/:id', authenticateUser, asyncHandler(async (req, res) => {
    const currentUserId = req.currentUser.datavalues.id;
    const course = await Course.findByPk(req.params.id);
    if (course) {
        if (course.userId === currentUserId) {
            try {
                await course.update(req.body);
                res.status(204).end();
            } catch (error) {
                if (error.name === 'SequelizeValidationError') {
                    const errors = error.errors.map(err => err.message);
                    res.status(400).json({ errors });
                } else {
                    throw error;
                };
            };
        } else {
            res.status(403).json({ message: 'You are not authorized to update this course' });
        };
    } else {
        res.status(404).json({ message: 'Course not found' });
    };
}));

// DELETE /api/courses/:id 204 - Deletes a course and returns no content
router.delete('/:id', authenticateUser, asyncHandler(async (req, res) => {
    const currentUserId = req.currentUser.datavalues.id;
    const course = await Course.findByPk(req.params.id);
    if (course) {
        if (course.userId === currentUserId) {
            await course.destroy();
            res.status(204).end();
        } else {
            res.status(403).json({ message: 'You are not authorized to delete this course' });
        };
    } else {
        res.status(404).json({ message: 'Course not found' });
    };
}));

module.exports = router;

