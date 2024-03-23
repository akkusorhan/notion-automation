const express = require("express");
const mongoose = require("mongoose");
const { Client } = require("@notionhq/client")
require("dotenv").config()

const app = express()
const notion = new Client({ auth: process.env.NOTION_API_KEY })

const Contact = require("./models/contact")
let port = process.env.PORT || 3000

app.listen(port)
app.use(express.json())

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
            'First Name': { title: [{ text: { content: req.body.data.firstName } }] },
            'Last Name': { title: [{ text: { content: req.body.data.lastName } }] },
            'Email': { rich_text: [{ text: { content: req.body.data.email } }] },
            'Phone': { rich_text: [{ text: { content: req.body.data.phone } }] },
            'Location': { rich_text: [{ text: { content: req.body.data.location } }] },
            'Lead Source': { rich_text: [{ text: { content: req.body.data.source } }] },
            'Service': { rich_text: [{ text: { content: req.body.data.service } }] }
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