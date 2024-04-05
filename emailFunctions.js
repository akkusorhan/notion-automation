const nodemailer = require("nodemailer")

const emailTemplates = require("./emailTemplates")

// Lead Generated Email
async function sendInitialEmail(req) {
    let recipientFirstName = req.body.data.firstName
    let recipientEmail = req.body.data.email

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SMTP_APP_PASSWORD
            },
            authMethod: "PLAIN"
        })

        // Define email options
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: recipientEmail, // process.env.RECIPIENT_EMAIL,
            subject: recipientFirstName == "{{contact.Name.First}}" ? emailTemplates.leadGeneratedSubject : `${recipientFirstName} - ${emailTemplates.leadGeneratedSubject}`,
            // text: "This is a test email"
            html: `
                <p style="margin-bottom: 30px;">Hi ${recipientFirstName == "{{contact.Name.First}}" ? "There" : recipientFirstName},</p>

                ${emailTemplates.leadGeneratedBody}
            `
        }

        // Send email
        const info = await transporter.sendMail(mailOptions)
        console.log("Email sent successfully: ", info)
    } catch (error) {
        console.error("Error occurred while sending email: ", error)
    }
}

// First Follow Up Email
async function sendFirstFollowUpEmail(req) {
    let recipientFirstName = req.body.data.firstName
    let recipientEmail = req.body.data.email

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SMTP_APP_PASSWORD
            },
            authMethod: "PLAIN"
        })

        // Define email options
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: recipientEmail, // process.env.RECIPIENT_EMAIL,
            subject: recipientFirstName == "{{contact.Name.First}}" ? emailTemplates.firstFollowBuSubject : `${recipientFirstName} - ${emailTemplates.firstFollowBuSubject}`,
            // text: "This is a test email"
            html: `
                <p style="margin-bottom: 30px;">Hi ${recipientFirstName == "{{contact.Name.First}}" ? "There" : recipientFirstName},</p>

                ${emailTemplates.firstFollowUpBody}
            `
        }

        // Send email
        const info = await transporter.sendMail(mailOptions)
        console.log("Email sent successfully: ", info)
    } catch (error) {
        console.error("Error occurred while sending email: ", error)
    }
}

// Second Follow Up Email
async function sendSecondFollowUpEmail(req) {
    let recipientFirstName = req.body.data.firstName
    let recipientEmail = req.body.data.email

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SMTP_APP_PASSWORD
            },
            authMethod: "PLAIN"
        })

        // Define email options
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: recipientEmail, // process.env.RECIPIENT_EMAIL,
            subject: recipientFirstName == "{{contact.Name.First}}" ? emailTemplates.secondFollowUpSubject : `${recipientFirstName} - ${emailTemplates.secondFollowUpSubject}`,
            // text: "This is a test email"
            html: `
                <p style="margin-bottom: 30px;">Hi ${recipientFirstName == "{{contact.Name.First}}" ? "There" : recipientFirstName},</p>

                ${emailTemplates.secondFollowUpBody}
            `
        }

        // Send email
        const info = await transporter.sendMail(mailOptions)
        console.log("Email sent successfully: ", info)
    } catch (error) {
        console.error("Error occurred while sending email: ", error)
    }
}

// Final Follow Up Email
async function sendFinalFollowUpEmail(req) {
    let recipientFirstName = req.body.data.firstName
    let recipientEmail = req.body.data.email

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SMTP_APP_PASSWORD
            },
            authMethod: "PLAIN"
        })

        // Define email options
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: recipientEmail, // process.env.RECIPIENT_EMAIL,
            subject: recipientFirstName == "{{contact.Name.First}}" ? emailTemplates.finalFollowUpSubject : `${recipientFirstName} - ${emailTemplates.finalFollowUpSubject}`,
            // text: "This is a test email"
            html: `
                <p style="margin-bottom: 30px;">Hi ${recipientFirstName == "{{contact.Name.First}}" ? "There" : recipientFirstName},</p>

                ${emailTemplates.finalFollowUpBody}
            `
        }

        // Send email
        const info = await transporter.sendMail(mailOptions)
        console.log("Email sent successfully: ", info)
    } catch (error) {
        console.error("Error occurred while sending email: ", error)
    }
}

module.exports = {
    sendInitialEmail,
    sendFirstFollowUpEmail,
    sendSecondFollowUpEmail,
    sendFinalFollowUpEmail
}