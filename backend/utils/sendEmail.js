const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Transporter setup
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_EMAIL, 
      pass: process.env.SMTP_PASSWORD, 
    },
  });

  // Message details
  const message = {
    from: `${process.env.FROM_NAME || 'E-Commerce Store'} <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // Send Email
  await transporter.sendMail(message);
};

module.exports = sendEmail;