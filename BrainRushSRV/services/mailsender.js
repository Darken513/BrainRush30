const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'aphatrack@gmail.com',
    pass: 'kxvqhzxgddkeijpe'
  }
});

exports.sendMail = (userDetails) => {
  let mailOptions = {
    from: "Aphatrack",
    to: userDetails.email,
    subject: "Today's test is available",
    html: `<div style=\"height:440px;width:600px;background:#222;border-radius:30px;margin:auto\"><h1 style=\"padding-top:50px;margin:0;text-align:center;color:#9acd32;font-size:3rem\">Aphatrack!</h1><h2 style=\"color:#fff;font-weight:100;text-align:center;margin:0;font-size:16px\">Your test awaits</h2><div style=\"padding:30px;text-align:center;font-size:18px;color:#fff\"><p><span style=\"color:#9acd32\">${userDetails.username}</span>, we missed you today!</p><p>Looks like you didn’t get a chance to practice today. Don’t worry, it’s easy to get back into it!</p></div><a href=\"http://localhost:4200\" style=\"display:block;width:45%;font-size:18px;border-radius:15px;margin:auto;border:none;font-weight:600;background:#5186e7;color:#222;text-align:center;padding:13px\">Continue practicing</a></div>`
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
  });
}