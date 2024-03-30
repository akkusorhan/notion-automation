const express = require("express");
const mongoose = require("mongoose");
const { Client } = require("@notionhq/client")
const GmailLogic = require("./GmailLogic")
require("dotenv").config()

const nodemailer = require("nodemailer")


const { google } = require("googleapis")
const { JWT } = require('google-auth-library');
const bodyParser = require('body-parser');

const app = express()
const notion = new Client({ auth: process.env.NOTION_API_KEY })

const Contact = require("./models/contact")
let port = process.env.PORT || 3000

app.listen(port)
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Service account credentials
const SERVICE_ACCOUNT_EMAIL = process.env.SERVICE_ACCOUNT_EMAIL // Service account email address
const PRIVATE_KEY = process.env.PRIVATE_KEY // Service account private key (replace newlines with '\n')

// OAuth2 client using service account credentials
const jwtClient = new JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.readonly']
})

// OAuth2 authentication
async function authenticate() {
    try {
        await jwtClient.authorize();
        console.log("Authentication successful") //jwtClient.credentials
        // Log access token
        // console.log("Access Token:", jwtClient.credentials.access_token);
        return jwtClient.credentials.access_token;

    } catch (error) {
        console.log("Error occurred during authentication: ", error)
    }
}

// Initialize authentication
// authenticate()

// Send email function
async function sendEmail() {
    try {
        console.log("Access Token:", jwtClient.credentials.access_token); // Log access token
        // create Nodemailer transporter using JWT client for authentication
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: 'smtp-relay.gmail.com', // Gmail SMTP relay server
            port: 465, // SMTP port (Gmail uses port 465 for SSL/TLS)
            secure: true, // Use SSL/TLS
            auth: {
                type: "OAuth2",
                user: process.env.SERVICE_ACCOUNT_EMAIL,
                accessToken: jwtClient.credentials.access_token // jwtClient.credentials.access_token
            }
        })

        // Define email options
        const mailOptions = {
            from: process.env.SERVICE_ACCOUNT_EMAIL, 
            to: process.env.RECIPIENT_EMAIL,
            subject: "Test Email",
            text: "This is a test email"
        }

        // Send email
        const info = await transporter.sendMail(mailOptions)
        console.log("Email send successfully: ", info)
    } catch (error) {
        console.error("Error occurred while sending email: ", error)
    }
}

async function emailAutomation() {
    try {
        await authenticate()
        await sendEmail()
    } catch (error) {
        console.log(error)
    }
}

emailAutomation()

// sendEmail()

mongoose.connect("mongodb+srv://admin:" + process.env.DB_PASSWORD + process.env.MONGODB_CLUSTER)

app.post("/newcontact", (req, res) => {
    /**
     * Handle MongoDB POST Request
     */
    const contact = new Contact({
        id: new mongoose.Types.ObjectId(),
        data: {
            firstName: req.body.data.firstName,
            lastName: req.body.data.lastName,
            email: req.body.data.email,
            phone: req.body.data.phone,
            service: req.body.data.service,
            location: req.body.data.location,
            source: req.body.data.source
        }
    })
    contact
    .save()
    .then(result => {
        console.log(result)
        res.status(201).json({
            message: "Handling POST request to /newcontact",
            createdContact: result,
            request: {
                type: "POST"
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })

    /**
     * Handle Notion API POST Request
     */
    const newEntry = {
        parent: { "type": "database_id", "database_id": process.env.NOTION_DATABASE_ID },
        properties: { 
            "Name": { "type": "title", "title": [{ "type": "text", "text": { "content": `${req.body.data.firstName} ${req.body.data.lastName}` } }] },
            "First Name": { "rich_text": [{ "type": "text", "text": { "content": req.body.data.firstName } }] },
            "Last Name": { "rich_text": [{ "type": "text", "text": { "content": req.body.data.lastName } }] },
            "Email": { "email": req.body.data.email },
            "Phone": { "phone_number": req.body.data.phone },
            "Service": { "rich_text": [{ "type": "text", "text": { "content": req.body.data.service } }] },
            "Location": { "rich_text": [{ "type": "text", "text": { "content": req.body.data.location } }] },
            "Lead Source": { "rich_text": [{ "type": "text", "text": { "content": req.body.data.source } }] },
            "Status": { "status": { "name": "Lead Generated" } }
        }
    }
    
    // Making POST request to Notion database
    async function createDatabaseEntry() {
        try {
            const response = await notion.pages.create(newEntry)
            console.log("New Notion database entry created: ", response)
        } catch (error) {
            console.log("Error occured while trying to create Notion database entry", error)
        }
    }

    createDatabaseEntry()

})

app.get("/newcontact", (req, res) => {
    const randomText = "text"
    GmailLogic(randomText)

    Contact.find()
    .select("data firstName lastName email phone service location source")
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.count, 
            contacts: docs.map(doc => {
                return {
                    firstName: doc.data.firstname,
                    lastName: doc.data.lastName,
                    email: doc.data.email,
                    phone: doc.data.phone,
                    service: doc.data.service,
                    location: doc.data.location,
                    source: doc.data.source,
                    id: doc._id,
                    request: {
                        type: "GET"
                    }
                }
            })
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

app.get("/newcontact/:contactID", (req, res) => {
    const id = req.params.contactID
    Contact.findById(id)
    .exec()
    .then(response => {
        if(!response) {
            res.status(404).json({
                message: "Contact not found."
            })
        } else {
            res.status(200).json({
                contact: response, 
                request: {
                    type: "GET"
                }
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

app.patch("/newcontact/:contactID", (req, res) => {
    const updates = req.body

    Contact.findByIdAndUpdate(req.params.contactID, updates)
    .exec()
    .then(response => {
        if (!response) {
            res.status(404).json({ message: "Contact Not Found" })
        } else {
            res.status(200).json({
                contact: response
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})

app.delete("/newcontact/:contactID", (req, res) => {
    Contact.findByIdAndDelete(req.params.contactID)
    .exec()
    .then(response => {
        if (!response) {
            res.status(400).json({ error: "Contact Not Found" })
        } else {
            res.status(200).json(response);
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})