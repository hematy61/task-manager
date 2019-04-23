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

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'mo.hemati@mhemati.com',
    subject: 'Cancellation Approval',
    html: `
    <h1 style="
    color: red;
    "
    >Hi ${name}. This is Cancellation Approval</h1>
    <p style="
        font-size: 3rem;
      "
    >Your account is removed from database successfully.</p>
    `
  })
}
module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
}