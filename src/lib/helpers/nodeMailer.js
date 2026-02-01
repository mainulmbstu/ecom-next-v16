import nodemailer from "nodemailer";
// const nodemailer = require("nodemailer");

const mailer = async ( credential) => {

  const transporter = await nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const message = {
    from: `"Mainul Hasan" ${process.env.EMAIL}`, // sender address
    to: `${credential.email}`,
    //   "bar@example.com, baz@example.com",
    // list of receivers
    subject: credential?.subject, // Subject line
    // text: credential?.body,
    // plain text body
    html: `<b>${credential?.body}</b>`, // html body
    attachments: credential?.attachments && credential?.attachments,
  };
    let info = await transporter.sendMail(message);
    
};

export default mailer
// module.exports=mailer

