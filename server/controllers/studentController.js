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

function sendEmail(email,code){

  
  const folderpath=path.join(__dirname,'qrcodes')
  const filepath=path.join(folderpath,'qrcode.png')

  if (!fs.existsSync(folderpath)) {
  fs.mkdirSync(folderpath);
}


  Qrcode.toFile(filepath, code, {
    color: {
      dark: '#000',  // QR code color
      light: '#FFF'  // Background color
    }
  }, function (err) {
    if (err) console.log(err);
    console.log('QR code saved!');
  });
  
  
  let transporter=nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'genaiclubternacollege@gmail.com',        // your Gmail address
        pass: 'avhj grem bukj nnqj'  // Gmail App Password (not your regular password)
      }
    })
  
    let mailOptions = {
  from: 'genaiclubternacollege@gmail.com',
  to: email,
  subject: '🎮 Your Gaming Café Coupon is Ready! 🚀',
  html: `
    <div style="font-family: Arial, sans-serif; text-align: center; background: #1e1e2f; padding: 20px; color: #fff; border-radius: 12px;">
      <h2 style="color: #00ff99;">🔥 Congratulations, Gamer! 🔥</h2>
      <p style="font-size: 16px;">You've unlocked an exclusive <b>Gaming Café Coupon</b>. Show this QR code at the counter to redeem your discount and power up your playtime! ⚡</p>
      <div style="margin: 20px 0;">
        <img src="cid:qrcode" alt="QR Code" style="border: 5px solid #00ff99; border-radius: 10px; max-width: 200px;" />
      </div>
      <p style="font-size: 18px; margin: 10px 0;">💥 Your Unique Code: <b style="color:#00ff99; font-size:20px;">${code}</b></p>
      <p style="font-size: 14px; color: #bbb;">⚠️ Valid for one-time use only. Don’t share this code with others.</p>
      <hr style="border: 1px solid #444; margin: 20px 0;">
      <p style="font-size: 14px; color: #888;">Game On,<br/>🎮 [Your Café Name] Team</p>
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

  
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log('Error sending email:', error);
      }
      console.log('Email sent: ' + info.response);
    });
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

    sendEmail(email,couponCode);

    await student.save();

    res.status(201).json({ msg: 'Student registered successfully!', student });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

