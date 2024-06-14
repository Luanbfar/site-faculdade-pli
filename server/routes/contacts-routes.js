const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
require("dotenv").config();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.post("/send-mail", (req, res) => {
  const { name, email, msg } = req.body;
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      accessToken: process.env.ACCESS_TOKEN,
      refreshToken: process.env.REFRESH_TOKEN,
    },
  });
  let mailOptions = {
    from: email,
    to: process.env.USER_EMAIL,
    subject: "Nova mensagem de contato do site Apex Motors",
    text: `Nome: ${name}\nE-mail: ${email}\nMensagem: ${msg}`,
  };
  transporter.sendMail(mailOptions, (error, result) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    } else {
      res.status(200).json({ result });
    }
  });
});

module.exports = router;
