import nodemailer, { Transporter, SendMailOptions } from "nodemailer";

// Define types for the function parameters
interface SendForgotPasswordOtpEmailParams {
  email: string;
  otp: number;
  userType: string; // You can specify the actual user types (e.g., 'admin', 'user') if needed
}

interface SendVerificationOtpEmailParams {
  email: string;
  otp: number;
}

const sendForgotPasswordOtpEmail = ({
  email,
  otp,
  userType,
}: SendForgotPasswordOtpEmailParams): Promise<nodemailer.SentMessageInfo> => {
  return new Promise((resolve, reject) => {
    const transporter: Transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: process.env.EMAIL_SERVICE,
      port: Number(process.env.EMAIL_PORT), // Convert port to number if it's stored as a string
      auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASS,
      },
    });

    const mailOptions: SendMailOptions = {
      from: `NO-REPLY ${process.env.EMAIL_AUTH_USER}`,
      to: email,
      subject: "Password reset OTP for your cccount",
      html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 30px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 40px;">
          <h2 style="color: #d35400; text-align: center;">🔐 Password Reset OTP</h2>
          <p style="font-size: 16px; color: #555;">Hello,</p>
          <p style="font-size: 16px; color: #555;">
            We received a request to reset the password for your <strong>Sociofy</strong> account. Use the OTP below to proceed:
          </p>
         <div style="text-align: center; margin: 40px 0;">
            <span style="display: inline-block; padding: 15px 28px; font-size: 26px; color: #fff; background-color: #6e5eff; border-radius: 8px; letter-spacing: 5px; font-weight: bold;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 15px; color: #888;">⚠️ This OTP will expire in 15 minutes. If you didn’t request a reset, please ignore this message.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
          <p style="font-size: 16px; color: #333;">Best regards,<br><strong>The Sociofy Team</strong></p>
        </div>
      </div>
    `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Email sending error: ", error);
        reject(error);
      } else {
        console.log("Email sent: ", info.response);
        resolve(info);
      }
    });
  });
};

const sendAccountVerificationOtpEmail = ({
  email,
  otp,
}: SendVerificationOtpEmailParams): Promise<nodemailer.SentMessageInfo> => {
  return new Promise((resolve, reject) => {
    const transporter: Transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: process.env.EMAIL_SERVICE,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASS,
      },
    });

    const mailOptions: SendMailOptions = {
      from: `NO-REPLY ${process.env.EMAIL_AUTH_USER}`,
      to: email,
      subject: "Email Verification OTP for Your Account",
      html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f2f6fc; padding: 30px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 40px;">
          <h1 style="color: #2c3e50; text-align: center;">🎉 Welcome to Sociofy!</h1>
          <p style="font-size: 16px; color: #555;">Hello,</p>
          <p style="font-size: 16px; color: #555;">
            Thank you for registering as a user on <strong>Sociofy</strong>! To complete your registration, please enter the following OTP to verify your email:
          </p>
          <div style="text-align: center; margin: 40px 0;">
            <span style="display: inline-block; padding: 15px 28px; font-size: 26px; color: #fff; background-color: #6e5eff; border-radius: 8px; letter-spacing: 5px; font-weight: bold;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 15px; color: #888;">⚠️ This OTP is valid for 2 minutes. If you did not request this, you can safely ignore the email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eaeaea;" />
          <p style="font-size: 16px; color: #333;">Kind regards,<br><strong>The Sociofy Team</strong></p>
        </div>
      </div>
    `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Email sending error: ", error);
        reject(error);
      } else {
        console.log("Email sent: ", info.response);
        resolve(info);
      }
    });
  });
};

export { sendForgotPasswordOtpEmail, sendAccountVerificationOtpEmail };
