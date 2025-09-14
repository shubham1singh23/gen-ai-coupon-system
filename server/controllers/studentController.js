const Student = require('../models/Student');
const crypto=require('crypto')
const Qrcode=require('qrcode')
const path=require('path')
const nodemailer=require('nodemailer')
const fs=require('fs')

function generateCouponCode(length = 10) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let coupon = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, chars.length);
    coupon += chars[randomIndex];
  }
  return coupon;
}

async function sendEmail(email, code) {
  try {
    // Generate QR code as data URL
    const qrCodeDataURL = await Qrcode.toDataURL(code, {
      color: {
        dark: '#000',  // QR code color
        light: '#FFF'  // Background color
      }
    });
    
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'genaiclubternacollege@gmail.com',
        pass: 'avhj grem bukj nnqj'
      }
    });
  
    let mailOptions = {
  from: 'genaiclubternacollege@gmail.com',
  to: email,
  subject: '🎮 Your Gaming Café Coupon is Ready! 🚀',
  html: `
    <div style="font-family: Arial, sans-serif; background: #121212; padding: 25px; color: #fff; border-radius: 14px; max-width: 600px; margin: auto; box-shadow: 0 4px 15px rgba(0,0,0,0.7);">
      
      <!-- Header -->
      <div style="background: linear-gradient(90deg, #6a11cb, #2575fc); padding: 18px; border-radius: 10px;">
        <h2 style="margin: 0; color: #fff; font-size: 24px;">🔥 Congratulations, Gamer! 🔥</h2>
      </div>

      <!-- Body -->
      <div style="text-align: center; padding: 20px;">
        <p style="font-size: 16px; line-height: 1.6; color: #ddd;">
          You’ve unlocked an exclusive <b>Gaming Café Discount Coupon</b>!  
          Show this QR code at the counter and boost your playtime ⚡
        </p>

        <!-- QR Code -->
        <div style="margin: 25px 0;">
          <img src="cid:qrcode" alt="QR Code" style="border: 4px solid #00ff99; border-radius: 12px; max-width: 220px; box-shadow: 0 0 20px rgba(0,255,153,0.6);" />
        </div>

        <!-- Code -->
        <p style="font-size: 18px; margin: 15px 0; color: #fff;">
          💥 Your Unique Code:  
          <b style="color:#00ff99; font-size:22px;">${code}</b>
        </p>

        <p style="font-size: 14px; color: #aaa; margin-top: 10px;">
          ⚠️ Valid for one-time use only. Please don’t share this code with others.
        </p>
      </div>

      <!-- Footer -->
      <hr style="border: 0; height: 1px; background: #333; margin: 20px 0;">
      <p style="font-size: 13px; color: #888; text-align: center;">
        Game On,<br/>🎮 <b>[Your Café Name]</b> Team
      </p>
    </div>
  `,
  attachments: [
    {
      filename: 'qrcode.png',
      path: filepath,
      cid: 'qrcode' // embed QR in email body
    }
  ]
};


  
  
      try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.response);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email: ' + error.message);
    }
  } catch (error) {
    console.error('Error in sendEmail function:', error);
    throw new Error('Failed to process email: ' + error.message);
  }
}

exports.registerStudent = async (req, res) => {
  const { collegeId, name, email, phone, couponType} = req.body;
  const couponCode=generateCouponCode()

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

    try {
      await sendEmail(email, couponCode);
      await student.save();
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Still save the student but return a warning
      await student.save();
      return res.status(201).json({ 
        msg: 'Student registered but email delivery failed. Please check the email address.',
        student,
        emailError: true
      });
    }

    res.status(201).json({ msg: 'Student registered successfully!', student });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Validate coupon code
exports.validateCoupon = async (req, res) => {
  const { couponCode } = req.body;

  try {
    // Find student with the given coupon code
    const student = await Student.findOne({ couponCode });

    if (!student) {
      return res.status(404).json({ 
        success: false,
        msg: 'Invalid coupon code. Please try again.' 
      });
    }

    if (student.used) {
      return res.status(400).json({ 
        success: false,
        msg: 'This coupon has already been used.' 
      });
    }

    // Check if coupon is expired (7 days)
    const createdAt = new Date(student.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - createdAt);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
      return res.status(400).json({ 
        success: false,
        msg: 'This coupon has expired.' 
      });
    }

    // Mark coupon as used
    student.used = true;
    await student.save();

    // Check if student is in first 50 (only for Individual type)
    let isInFirstFifty = false;
    let offerMessage = '';

    if (student.couponType === 'Individual') {
      const totalEarlierIndividuals = await Student.countDocuments({
        createdAt: { $lt: student.createdAt },
        couponType: 'Individual'
      });

      isInFirstFifty = totalEarlierIndividuals < 50;
      offerMessage = isInFirstFifty 
        ? '🎁 Congratulations! You are eligible for 1 Hour FREE Gaming Session!' 
        : '🎮 You get 30% discount on all gaming sessions';
    } else {
      offerMessage = '👥 Team Offer: Pay for 3 players and Play as 4!';
    }

    return res.status(200).json({
      success: true,
      msg: 'Coupon validated successfully!',
      data: {
        collegeId: student.collegeId,
        name: student.name,
        couponType: student.couponType,
        isInFirstFifty,
        offerMessage
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false,
      msg: 'Server Error' 
    });
  }
};

// Get all students sorted by timestamp
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .sort({ createdAt: 1 }) // 1 for ascending order (oldest first)
      .select('name collegeId couponType createdAt used'); // Select only necessary fields

    res.status(200).json({ 
      success: true,
      data: students 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      success: false,
      msg: 'Server Error' 
    });
  }
};
