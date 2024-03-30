const nodemailer = require("nodemailer")
const schedule = require("node-schedule")

const EMAIL_SERVICE = "gmail"
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL

const transponder = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
    }
})

function sendEmail(subject, body) {
    const mailOptions = {
        from: EMAIL_USER,
        to: RECIPIENT_EMAIL,
        subject: subject,
        body: body
    }

    transponder.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email: ", error)
        } else {
            console.log("Email sent successfully: ", info.response)
        }
    })
}

function GmailLogic(recipientEmail) {
    const emailSubject = "Test Subject"
    const emailBody = "Test Body"
    sendEmail(emailSubject, emailBody)
}

module.exports = GmailLogic