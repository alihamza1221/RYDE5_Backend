const dotenv = require("dotenv");
dotenv.config();
const transporter = require("../utils/nodemailer");
module.exports.sendOtp = async (to, otp) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMPT_MAIL,
      to,
      subject: "Your OTP",
      html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Your OTP</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f9f9f9;
                    }
                    .header {
                        background-color: #4CAF50;
                        color: white;
                        text-align: center;
                        padding: 10px;
                    }
                    .content {
                        background-color: white;
                        padding: 20px;
                        border-radius: 5px;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 20px;
                        font-size: 0.8em;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Your OTP</h1>
                    </div>
                    <div class="content">
                        <p>Your OTP is <strong>${otp}</strong></p>
                    </div>
                    <div class="footer">
                        <p>This is an automated email. Please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
            `,
    });
  } catch (error) {
    console.log(error);
  }
};
