const nodemailer = require("nodemailer");
exports.templateMail = (name, code) => {
  return `Hi ${name}\nThis is the activation code\n${code}\nThis Code valid for 15 min.\nIf you didn't request a password reset you can delete this email.`;
};
exports.sendEmail = async (options) => {
  // Email config
  const transport = nodemailer.createTransport({
    host: process.env.HOST_MAIL,
    port: process.env.PORT_MAIL,
    secure: process.env.SECURE_MAIL,
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.PASSWORD_MAIL,
    },
  });
  // Email options
  const message = {
    from: process.env.FROM_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // Send email
  await transport.sendMail(message);
};
