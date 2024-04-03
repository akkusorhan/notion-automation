const nodemailer = require("nodemailer")
const schedule = require("node-schedule")
const { google } = require("googleapis")
const { JWT } = require('google-auth-library');
const { Client } = require("@notionhq/client")

const notion = new Client({ auth: process.env.NOTION_API_KEY })
require("dotenv").config()

const emailTemplates = require("./emailTemplates")

/**
 * Handling OAuth
 */
const privateKey = process.env.PRIVATE_KEY
const serviceAccountEmail = process.env.SERVICE_ACCOUNT_EMAIL

// Auth credentials & scope
const auth = new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: [
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.readonly',
        // 'https://www.googleapis.com/auth/contacts'
    ]
})

async function authenticate() {
    try {
        await auth.authorize() // This will automatically obtain and set the access token
        console.log("Authorization successful")
        return auth.credentials.access_token
    } catch (error) {
        console.error('Error occurred during authentication:', error);
    }
}

/**
 * Handling Google Contacts/People API
 */
const contacts = google.people({
    version: "v1",
    auth: auth
})

// Create the contact
async function createContact() {
    try {
        const contactData = {
            "names": [
                {
                    "givenName": "Owen",
                    "familyName": "Zurich"
                }
            ],
            "emailAddresses": [
                {
                    "value": "owenzurich@gmail.com"
                }
            ],
            "phoneNumbers": [
                {
                    "value": "2812434597"
                }
            ]
        }

        const response = await contacts.people.createContact({
            requestBody: contactData
        })
        console.log('Contact created successfully:', response.data);
    } catch (error) {
        console.error('Error occurred while creating contact:', error);
    }
}


/**
 *  Email send functions
 */
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

/**
 * Check For Received Email
 */
async function searchEmailsBySender(req) {
    try {
        // Authenticate with Gmail API using JWT credentials
        const auth2 = new google.auth.JWT({
            email: serviceAccountEmail,
            key: privateKey,
            scopes: [
                // 'https://www.googleapis.com/auth/gmail.send',
                'https://www.googleapis.com/auth/gmail.readonly',
                // 'https://www.googleapis.com/auth/contacts'
            ]
        });

        // Obtain an access token
        await auth.authorize();

        // Perform a search query for emails from the sender
        let senderEmail = req.body.data.email

        // Initialize the Gmail API
        const gmail = google.gmail({
            version: 'v1',
            auth: auth
        });

        const response = await gmail.users.messages.list({
            userId: process.env.SENDER_EMAIL, // 'me', // 'me' refers to the authenticated user
            q: `from:${senderEmail}`, // Search query to filter emails by sender
        });

        // Handle the response
        const emails = response.data.messages;
        if (emails && emails.length > 0) {
            // Emails from the sender found
            console.log(`Found ${emails.length} emails from ${senderEmail}:`);
            emails.forEach((email) => {
                console.log(`Email ID: ${email.id}`);
                // You can retrieve more information about each email if needed
            });
        } else {
            console.log(`No emails found from ${senderEmail}`);
        }
    } catch (error) {
        console.error('Error searching emails:', error);
    }
}




function GmailLogic(req) {
    async function emailAutomation() {
        try {
            await authenticate()

            await sendInitialEmail(req)

            // Wait for 30 seconds before calling the First Follow Up email
            await new Promise(resolve => setTimeout(resolve, 10000));
            await searchEmailsBySender(req)
            await sendFirstFollowUpEmail(req);

            // Wait for 30 seconds before calling the Second Follow Up email
            await new Promise(resolve => setTimeout(resolve, 10000));
            await searchEmailsBySender(req)
            await sendSecondFollowUpEmail(req);

            // Wait for 30 seconds before calling the Final Follow Up email
            await new Promise(resolve => setTimeout(resolve, 10000));
            await searchEmailsBySender(req)
            await sendFinalFollowUpEmail(req);

            // await createContact()
        } catch (error) {
            console.log(error)
        }
    }
    emailAutomation()
}

module.exports = GmailLogic