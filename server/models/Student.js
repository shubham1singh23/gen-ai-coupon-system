const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    collegeId: {
      type: String,
      required: [true, 'College ID is required'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    couponType: {
      type: String,
      enum: ['Individual', 'Team'],
      required: true,
    },
    couponCode: {
      type: String,
      unique: true,
      sparse: true, // This allows for multiple documents to have a null value
      trim: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Student', studentSchema);

