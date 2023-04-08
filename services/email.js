const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD,
  },
})
const sendMail = (employee) => {
  if (!employee.email) return
  transporter
    .sendMail({
      from: process.env.EMAIL_SENDER,
      to: employee.email,
      subject: 'An account has been locked',
      html: `<h1>帳號: ${
        employee.account
      } 已經被鎖定</h1><h2>時間: ${new Date().toISOString()}</h2>`,
    })
    .then(() => console.info('success send email'))
    .catch((err) => console.error(err))
}
module.exports = sendMail
