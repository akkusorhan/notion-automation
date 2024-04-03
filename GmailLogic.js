const nodemailer = require("nodemailer")
const schedule = require("node-schedule")
const { google } = require("googleapis")
const { JWT } = require('google-auth-library');
require("dotenv").config()

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
        'https://www.googleapis.com/auth/contacts'
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


// Send email function
async function sendEmail(recipientEmail, recipientFirstName) {
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
            subject: "Test Email",
            // text: "This is a test email"
            html: `
                <p>Hi ${recipientFirstName},</p>
                <p>I’m Orhan Akkus, a Wix Partner. Thanks for contacting me through the Wix Marketplace. I received your request and would like to discuss this project further.</p>
                <p>Let's schedule a time to talk about how we can help you with your website request. You can use <a href="https://www.blackwader.com/so/tr/4616408e-b93f-4f1b-8f15-ce86f80c6f45/c?w=xAhODhm5UrAPmwCZUd55xMT8E2cxtartHuL%2FaeiV6DM.eyJ1IjoiaHR0cHM6Ly93d3cuYmxhY2t3YWRlci5jb20vc2VydmljZS1wYWdlL3dlYi1kZXNpZ24taW5xdWlyeT9yZWZlcnJhbD1zZXJ2aWNlX2xpc3Rfd2lkZ2V0IiwiciI6ImQyZjIxZmQyLTcyZmEtNGNkNy1hOTg2LWM2ZWExYWFjYTU2NCIsImMiOiIzZDAyNDY0Zi1mMjQ2LTRmOWUtOTUyZi03ZmViNzdlZjYyOGEiLCJtIjoibWFpbCJ9">this link</a> to book a time for us to connect. We can discuss details <strong>over the phone, through email, or through video conference,</strong> whichever you prefer.</p>
                <p>We offer very competitive & affordable rates, and we also design our projects on the new Wix Studio platform by Wix, so you can rest assured that you are getting the absolute best service for the best price. </p>
                <p>Please schedule a time or simply reply to this email with how we can move forward along with any specifics, and we can go from there! Looking forward to hearing from you. In the meantime feel free to take a look at some of our previous projects, <a href="https://www.blackwader.com/web-design">linked here.</a> </p>
                <p><strong>Btw, this isn't some automated campaign; I promise :)</strong></p>
                <p>Kind Regards,</p>
                --
                <h3 style="margin: 5px 0;">Orhan Akkus</h3>
                <p style="margin: 5px 0;">Digital Marketing Consultant & Web Designer</p>
                <p style="margin: 5px 0;">+1 (949) 899-3222</p>
                <p style="margin: 5px 0;"><a href="mailto:orhan@blackwader.com">orhan@blackwader.com</a></p>
                <p style="margin: 5px 0;"><a href="https://blackwader.com">www.blackwader.com</a></p>
                <img src="https://ci3.googleusercontent.com/mail-sig/AIorK4zZ0UOoC8oQ3p14iiwDptYJhVajVBuniMqHVdS17FcyqzGBFW4fy3O7U2GtXD9wCJ1lxRjR9AM" alt="Email Signature" width="125" height="100">
            `
        }

        // Send email
        const info = await transporter.sendMail(mailOptions)
        console.log("Email sent successfully: ", info)
    } catch (error) {
        console.error("Error occurred while sending email: ", error)
    }
}



function GmailLogic(recipientEmail, recipientFirstName) {
    async function emailAutomation() {
        try {
            await authenticate()
            await sendEmail(recipientEmail, recipientFirstName)
            // await createContact()
        } catch (error) {
            console.log(error)
        }
    }
    emailAutomation()
}

module.exports = GmailLogic