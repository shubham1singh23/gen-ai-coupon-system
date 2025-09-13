const Student = require('../models/Student');

exports.registerStudent = async (req, res) => {
  const { collegeId, name, email, phone, couponType, couponCode } = req.body;

  try {
    let student = await Student.findOne({ $or: [{ collegeId }, { email }] });

    if (student) {
      return res.status(400).json({ msg: 'A student with this College ID or Email already exists.' });
    }

    //new student instance
    student = new Student({
      collegeId,
      name,
       email,
      phone,
      couponType,
      couponCode: couponCode || null, 
    });

    await student.save();

    res.status(201).json({ msg: 'Student registered successfully!', student });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

