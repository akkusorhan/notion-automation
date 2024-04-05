const nodemailer = require("nodemailer")
const schedule = require("node-schedule")
const { google } = require("googleapis")
const { JWT } = require('google-auth-library');
const { Client } = require("@notionhq/client")
require("dotenv").config()

const notion = new Client({ auth: process.env.NOTION_API_KEY }); //


const emailFunctions = require("./emailFunctions")
// const createNotionDatabaseEntry = require("./createNotionDatabaseEntry")

/**
 * Handle Notion API POST Request
 */
let notionPageId
async function createNotionDatabaseEntry(req) {
    try {
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
        const response = await notion.pages.create(newEntry)
        // console.log("New Notion database entry created: ", response.url)
        // console.log("New Notion database entry created: ", response.id)
        notionPageId = response.id
        // console.log(`NOTION PAGE ID ${notionPageId}`)
    } catch (error) {
        console.log("Error occured while trying to create Notion database entry", error)
    }
}

/**
 *  Email send functions
 */
async function GmailLogic(req) {
    try {
        // Check current time in PST
        let currentTimePST = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
        let currentHourPST = new Date(currentTimePST).getHours();

        // Check if current time is within the specified time range (5am PST to 8pm PST)
        while (currentHourPST < 5 || currentHourPST >= 20) {
            // Wait for 1 hour before checking the time again
            console.log("Current time is not within working hours, check again in 1 hour.")
            await new Promise(resolve => setTimeout(resolve, 60 * 60 * 1000)); // 1 hour in milliseconds

            // Update current time
            const newTimePST = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
            currentHourPST = new Date(newTimePST).getHours();
        }
        console.log("Current time is within working hours, proceed with function.")

        // POST to Notion DB
        await createNotionDatabaseEntry(req)

        // Send First Email
        await emailFunctions.sendInitialEmail(req)
        console.log("Notion page id:" + notionPageId)

        // Wait for 24 hours before calling the First Follow Up email
        await new Promise(resolve => setTimeout(resolve, 24 * 60 * 60 * 1000))
        const firstFollowUpResponse = await notion.pages.retrieve({ page_id: notionPageId });
        console.log(firstFollowUpResponse)
        if (firstFollowUpResponse.properties.Status.status.name !== "In Contact") {
            await emailFunctions.sendFirstFollowUpEmail(req)
            const pageId = notionPageId;
            const response = await notion.pages.update({
                page_id: pageId,
                properties: { "Status": { "status": { "name": "First Follow Up" } } },
            });
            // console.log(response);
            console.log("Status changed to: First Follow Up")
        } else { null }

        // Wait for 24 hours before calling the Second Follow Up email
        await new Promise(resolve => setTimeout(resolve, 24 * 60 * 60 * 1000));
        const secondFollowUpResponse = await notion.pages.retrieve({ page_id: notionPageId });
        console.log(secondFollowUpResponse)
        if (secondFollowUpResponse.properties.Status.status.name !== "In Contact") {
            await emailFunctions.sendSecondFollowUpEmail(req)
            const pageId = notionPageId;
            const response = await notion.pages.update({
                page_id: pageId,
                properties: { "Status": { "status": { "name": "Second Follow Up" } } },
            });
            // console.log(response)
            console.log("Status changed to: Second Follow Up")
        }

        // Wait for 24 hours before calling the Final Follow Up email
        await new Promise(resolve => setTimeout(resolve, 24 * 60 * 60 * 1000));
        const finalFollowUpResponse = await notion.pages.retrieve({ page_id: notionPageId });
        console.log(finalFollowUpResponse)
        if (finalFollowUpResponse.properties.Status.status.name !== "In Contact") {
            await emailFunctions.sendFinalFollowUpEmail(req)
            const pageId = notionPageId;
            const response = await notion.pages.update({
                page_id: pageId,
                properties: { "Status": { "status": { "name": "Archive" } } },
            });
            // console.log(response)
            console.log("Status changed to: Archive")
        }

    } catch (error) {
        console.log(error)
    }
}

module.exports = GmailLogic