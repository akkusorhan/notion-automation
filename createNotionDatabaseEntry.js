const { Client } = require("@notionhq/client")

const notion = new Client({ auth: process.env.NOTION_API_KEY })

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
        console.log(`NOTION PAGE ID ${notionPageId}`)
    } catch (error) {
        console.log("Error occured while trying to create Notion database entry", error)
    }
}

module.exports = {
    createNotionDatabaseEntry: createNotionDatabaseEntry,
    notionPageId: notionPageId
}