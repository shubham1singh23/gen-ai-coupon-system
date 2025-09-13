const express = require('express');
const router = express.Router();
const { 
  registerStudent, 
  validateCoupon,
  getAllStudents 
} = require('../controllers/studentController');

// @route   POST api/students
// @desc    Register a new student
// @access  Public
router.post('/', registerStudent);

// @route   POST api/students/validate-coupon
// @desc    Validate a coupon code
// @access  Public
router.post('/validate-coupon', validateCoupon);

// @route   GET api/students
// @desc    Get all students sorted by timestamp
// @access  Public
router.get('/', getAllStudents);

module.exports = router;

