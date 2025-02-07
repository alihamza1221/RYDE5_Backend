const nodemailer = require("nodemailer");

// const sendEmail = async (options) => {
//   const transporter = nodeMailer.createTransport({
//     host: process.env.SMPT_HOST,
//     port: process.env.SMPT_PORT,
//     auth: {
//       user: process.env.SMPT_MAIL,
//       pass: process.env.SMPT_PASSWORD,
//     },
//   });
//   const mailOption = {
//     from: process.env.SMPT_MAIL,
//     to: options.email,
//     // cc: process.env.ADMIN_EMAIL,
//     bcc: options.bcc,
//     subject: options.subject,
//     html: options.html,
//   };

//   await transporter.sendMail(mailOption);
//};

const transporter = nodemailer.createTransport({
  host: process.env.SMPT_HOST,
  port: process.env.SMPT_PORT,
  secure: false,
  auth: {
    user: process.env.SMPT_MAIL,
    pass: process.env.SMPT_PASSWORD,
  },
});

module.exports = transporter;
