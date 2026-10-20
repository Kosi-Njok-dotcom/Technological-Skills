const express = require('express');
const router = express.Router();

const {
  getCourses,
  seedCourses
} = require('../controllers/courseController');

const { authenticate } = require('../Middleware/auth');

// Get courses
router.get('/', authenticate, getCourses);

// Seed courses into the database
router.post('/seed', authenticate, seedCourses);

module.exports = router;
