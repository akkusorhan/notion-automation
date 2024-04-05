/**
 * Handling OAuth
 */
const privateKey = process.env.PRIVATE_KEY
const serviceAccountEmail = process.env.SERVICE_ACCOUNT_EMAIL

// Auth credentials & scope
const auth = null = new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: [
        // 'https://www.googleapis.com/auth/gmail.send',
        // 'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.modify',
        // 'https://www.googleapis.com/auth/contacts'
    ]
})

// // Set the access token manually
// auth.credentials = {
//     access_token: process.env.ACCESS_TOKEN
// };

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
 * Check For Received Email
 */
async function searchEmailsBySender(req) {
  try {
      // Perform a search query for emails from the sender
      let senderEmail = req.body.data.email

      // Initialize the Gmail API
      const gmail = google.gmail({
          version: 'v1',
          auth: auth
      });

      const response = await gmail.users.messages.list({
          'userId': 'me', // process.env.SENDER_EMAIL, // 'me', // 'me' refers to the authenticated user
          'q': `from:${senderEmail}`, // Search query to filter emails by sender

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
