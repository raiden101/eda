const nodemailer = require('nodemailer');
const { email_add, email_pwd } = require('../../../../../credentials/credentials');

module.exports = nodemailer.createTransport({
  service: "Gmail",
  pool: true,
  maxMessages: Infinity,
  auth: {
    user: email_add,
    pass: email_pwd
  },
  tls: {
    rejectUnauthorized: false
  }
})