const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'BrainRush30@gmail.com',
    pass: 'pqaazhiqeopvkhwj'
  }
});

/* let mailOptions = {
  from: '"BrainRush30!" <BrainRush30@gmail.com>',
  to: 'affesachraf70@gmail.com',
  subject: 'Hello ✔',
  text: 'Hello world?',
  html: '<b>Hello world?</b>'
}; */

exports.sendMail = (mailOptions) => {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
}