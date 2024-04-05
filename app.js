const express = require("express");
const mongoose = require("mongoose");
const { Client } = require("@notionhq/client")
const { google } = require("googleapis")
const { JWT } = require('google-auth-library');
const GmailLogic = require("./GmailLogic")
const saveToMongoDB = require("./saveToMongoDB")
const createNotionDatabaseEntry = require("./createNotionDatabaseEntry")
require("dotenv").config()

const nodemailer = require("nodemailer")
const bodyParser = require('body-parser');

const app = express()
const notion = new Client({ auth: process.env.NOTION_API_KEY })

const Contact = require("./models/contact")
let port = process.env.PORT || 3000

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://admin:" + process.env.DB_PASSWORD + process.env.MONGODB_CLUSTER)

app.post("/newcontact", (req, res) => {
    /**
     * Handle MongoDB POST Request
     */
    saveToMongoDB(req, res)

    /**
     * Handle Notion API POST Request
     */
    // createNotionDatabaseEntry.createNotionDatabaseEntry(req)
    
    /**
     * Initiate email campaign
     */
    GmailLogic(req)

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

app.listen(port, () => {

})