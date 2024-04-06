const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    const gmail = process.env.GMAIL_EMAIL;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: gmail,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: gmail,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = { sendEmail };
