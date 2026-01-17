import nodemailer from "nodemailer";

const sendEmail = async (to, subject, message) => {
  try {
    // ✅ transporter (ENV ke exact naam use ho rahe hain)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // 587 ke liye false
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
      }
    });

    // ✅ mail options
    const mailOptions = {
      from: `"Support Team" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html: message
    };

    // ✅ send email
    await transporter.sendMail(mailOptions);

  } catch (error) {
    console.error("SMTP ERROR 👉", error);
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;
