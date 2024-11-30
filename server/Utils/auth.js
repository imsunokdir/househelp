const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const sendEmailVerificationMail = ({ email, verifiedToken }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: "465",
    secure: true,
    service: "gmail",
    auth: {
      user: "funlaughter40@gmail.com",
      pass: "bpjw lhhx eqwr ezml",
    },
  });
  const mailOptions = {
    from: "fublaughter40@gmail.com",
    to: email,
    subject: "Email verification for HomeHelp",
    html: `<head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Todo App</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    
      <style type="text/css">
        a[x-apple-data-detectors] {color: inherit !important;}
      </style>
    
    </head>
    <body style="margin: 0; padding: 0;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="padding: 20px 0 30px 0;">
    
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; border: 1px solid #cccccc;">
      <tr>
        <td align="center" bgcolor="#defcf9" style="padding: 40px 0 30px 0;">
          <img src="https://www.jotform.com/blog/wp-content/uploads/2020/01/email-marketing-intro-02-700x544.png" alt="logo" width="300" height="230" style="display: block;" />
        </td>
      </tr>
      <tr>
        <td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
            <tr>
              <td style="color: #00adb5; font-family: Arial, sans-serif;">
                <h3 style="font-size: 24px; margin: 0; margin-bottom:6px; text-align:center; font-family: Montserrat, sans-serif;">Hey</h3>
                <h3 style="font-size: 24px; margin: 0; text-align:center; "color: #00adb5;  font-family: Montserrat, sans-serif;">Activate your Email</h3>
              </td>
            </tr>
            <tr>
              <td style="color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; padding: 20px 0 30px 0;">
              <a href="http://localhost:8000/api/v1/user/verify/${verifiedToken}" style=" border: none;
              background-color: #ef7e5c;
      color: white;
      padding: 15px 32px;
      text-align: center;
    
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 175px;
      cursor: pointer;
      border-radius:5px;">Activate Account</a>
              </td>
    
          </table>
        </td>
      </tr>
      <tr>
        <td bgcolor="#ef7e5c" style="padding: 30px 30px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
            <tr>
              <td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;">
                <p style="margin: 0;">&reg; Someone, somewhere 2021<br/>
               <a href="" style="color: #ffffff;">Subscribe</a> to us!</p>
              </td>
              </tr>
          </table>
        </td>
      </tr>
      </table>
    
          </td>
        </tr>
      </table>
    </body>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(
        `Email has been sent successfully to: ${email}` + info.response
      );
    }
  });
};

const generateJWTToken = (email, username) => {
  const token = jwt.sign({ email, username }, process.env.JWT_SECRET_KEY);
  return token;
};

const isEmailValidate = ({ key }) => {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // Correct email regex pattern
  return emailRegex.test(key); // Test if the email matches the regex pattern
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
};

module.exports = {
  sendEmailVerificationMail,
  generateJWTToken,
  isEmailValidate,
  generateOTP,
};
