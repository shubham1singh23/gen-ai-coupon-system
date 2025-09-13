const express = require('express');
const router = express.Router();
const { registerStudent } = require('../controllers/studentController');

// @route   POST api/students
// @desc    Register a new student
// @access  Public
router.post('/', registerStudent);

module.exports = router;

