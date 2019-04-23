const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'mo.hemati@mhemati.com',
    subject: 'Welcome',
    html: `<h1>Hi ${name},</h1>
    <p>Thanks for sending me an email. I'll reach you out ASAP</p>`

  })
}

module.exports = {
  sendWelcomeEmail
}