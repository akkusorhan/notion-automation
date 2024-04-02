// OAuth2 client using service account credentials
const jwtClient = new JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.readonly'],
    redirectUri: 'urn:ietf:wg:oauth:2.0:oob' // Placeholder redirect URI

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
authenticate()

// Send email function
async function sendEmail() {
    try {
        // create Nodemailer transporter using JWT client for authentication
        const transporter = nodemailer.createTransport({
            service: "gmail",
            // host: 'smtp.gmail.com', // SMTP server hostname
            // port: 587, // Port for TLS/STARTTLS encryption
            // secure: false, // true for 465, false for other ports
            auth: {
                // type: "OAuth2",
                user: process.env.SERVICE_ACCOUNT_EMAIL,
                pass: process.env.SMTP_APP_PASSWORD
                // accessToken: jwtClient.credentials.access_token // jwtClient.credentials.access_token
            },
            authMethod: "PLAIN"
        })

        // Define email options
        const mailOptions = {
            from: "",
            to: "",
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
        // await authenticate()
        await sendEmail()
    } catch (error) {
        console.log(error)
    }
}

emailAutomation()

// sendEmail()

// Service account credentials
const SERVICE_ACCOUNT_EMAIL = process.env.SERVICE_ACCOUNT_EMAIL // Service account email address
const PRIVATE_KEY = process.env.PRIVATE_KEY // Service account private key (replace newlines with '\n')

