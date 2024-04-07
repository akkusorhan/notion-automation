const nodemailer = require("nodemailer")
const schedule = require("node-schedule")
const { google } = require("googleapis")
const { JWT } = require('google-auth-library');
const { Client } = require("@notionhq/client")
require("dotenv").config()

const emailFunctions = require("./emailFunctions")
const createNotionDatabaseEntry = require("./createNotionDatabaseEntry")

const notion = new Client({ auth: process.env.NOTION_API_KEY }); //

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

        // POST to Notion DB, page id saved to notionPageId to be used to check status
        const notionPageId = await createNotionDatabaseEntry(req)
        await emailFunctions.sendNotificationEmail(req)
        console.log("NOTION ID FROM NEW FUNCTION:" + notionPageId)

        // Send First Email
        await new Promise(resolve => setTimeout(resolve, 7 * 60 * 1000)); // Wait 7 minutes before sending first email
        await emailFunctions.sendInitialEmail(req)
        console.log("Notion page id:" + notionPageId)

        // Wait for 24 hours before calling the First Follow Up email
        await new Promise(resolve => setTimeout(resolve, 24 * 60 * 60 * 1000))
        const firstFollowUpResponse = await notion.pages.retrieve({ page_id: notionPageId });
        const firstFollowUpResponseStatus = firstFollowUpResponse.properties.Status.status.name
        console.log(firstFollowUpResponse)

        if (firstFollowUpResponseStatus == "Lead Generated") { //  || firstFollowUpResponseStatus !== "In Contact"
            await emailFunctions.sendFirstFollowUpEmail(req)
            const pageId = notionPageId;
            const response = await notion.pages.update({ page_id: pageId, properties: { "Status": { "status": { "name": "First Follow Up" } } }, });
            // console.log(response);
            console.log("Status changed to: First Follow Up")
        } else { null }

        // Wait for 24 hours before calling the Second Follow Up email
        await new Promise(resolve => setTimeout(resolve, 24 * 60 * 60 * 1000));
        const secondFollowUpResponse = await notion.pages.retrieve({ page_id: notionPageId });
        const secondFollowUpStatus = secondFollowUpResponse.properties.Status.status.name
        console.log(secondFollowUpResponse)

        if (secondFollowUpStatus == "First Follow Up") { //  || secondFollowUpStatus !== "In Contact"
            await emailFunctions.sendSecondFollowUpEmail(req)
            const pageId = notionPageId;
            const response = await notion.pages.update({ page_id: pageId, properties: { "Status": { "status": { "name": "Second Follow Up" } } }, });
            // console.log(response)
            console.log("Status changed to: Second Follow Up")
        }

        // Wait for 24 hours before calling the Final Follow Up email
        await new Promise(resolve => setTimeout(resolve, 24 * 60 * 60 * 1000));
        const finalFollowUpResponse = await notion.pages.retrieve({ page_id: notionPageId });
        const finalFollowUpStatus = finalFollowUpResponse.properties.Status.status.name
        console.log(finalFollowUpResponse)

        if (finalFollowUpStatus == "Second Follow Up") { //  || finalFollowUpStatus !== "In Contact"
            await emailFunctions.sendFinalFollowUpEmail(req)
            const pageId = notionPageId;
            const response = await notion.pages.update({ page_id: pageId, properties: { "Status": { "status": { "name": "Archive" } } }, });
            // console.log(response)
            console.log("Status changed to: Archive")
        }

    } catch (error) {
        console.log(error)
    }
}

module.exports = GmailLogic