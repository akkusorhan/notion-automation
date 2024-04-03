require("dotenv").config()
const emailFooter = `
    <h3 style="margin: 5px 0;">Orhan Akkus</h3>
    <p style="margin: 5px 0;">Digital Marketing Consultant & Web Designer</p>
    <p style="margin: 5px 0;">+1 (949) 899-3222</p>
    <p style="margin: 5px 0;"><a href="mailto:orhan@blackwader.com">orhan@blackwader.com</a></p>
    <p style="margin: 5px 0;"><a href="https://blackwader.com">www.blackwader.com</a></p>
    <img src="https://ci3.googleusercontent.com/mail-sig/AIorK4zZ0UOoC8oQ3p14iiwDptYJhVajVBuniMqHVdS17FcyqzGBFW4fy3O7U2GtXD9wCJ1lxRjR9AM" alt="Email Signature" width="125" height="100">
`

const emailTemplates = {
    leadGeneratedSubject: "Your Wix Project",
    leadGeneratedBody: 
        `<p>I’m Orhan Akkus, a Wix Partner. Thanks for contacting me through the Wix Marketplace. I received your request and would like to discuss this project further.</p>
        <p>Let's schedule a time to talk about how we can help you with your website request. You can use <a href="https://www.blackwader.com/so/tr/4616408e-b93f-4f1b-8f15-ce86f80c6f45/c?w=xAhODhm5UrAPmwCZUd55xMT8E2cxtartHuL%2FaeiV6DM.eyJ1IjoiaHR0cHM6Ly93d3cuYmxhY2t3YWRlci5jb20vc2VydmljZS1wYWdlL3dlYi1kZXNpZ24taW5xdWlyeT9yZWZlcnJhbD1zZXJ2aWNlX2xpc3Rfd2lkZ2V0IiwiciI6ImQyZjIxZmQyLTcyZmEtNGNkNy1hOTg2LWM2ZWExYWFjYTU2NCIsImMiOiIzZDAyNDY0Zi1mMjQ2LTRmOWUtOTUyZi03ZmViNzdlZjYyOGEiLCJtIjoibWFpbCJ9">this link</a> to book a time for us to connect. We can discuss details <strong>over the phone, through email, or through video conference,</strong> whichever you prefer.</p>
        <p>We offer very competitive & affordable rates, and we also design our projects on the new Wix Studio platform by Wix, so you can rest assured that you are getting the absolute best service for the best price. </p>
        <p>Please schedule a time or simply reply to this email with how we can move forward along with any specifics, and we can go from there! Looking forward to hearing from you. In the meantime feel free to take a look at some of our previous projects, <a href="https://www.blackwader.com/web-design">linked here.</a> </p>
        <p><strong>Btw, this isn't some automated campaign; I promise :)</strong></p>
        <p>Kind Regards,</p>
        --
        ${emailFooter}
    `,
    firstFollowBuSubject: "Let's try this again",
    firstFollowUpBody: 
        `<p>I’m Orhan Akkus, a Wix Partner. Thanks for contacting me through the Wix Marketplace. I received your request and would like to discuss this project further.</p>
        <p>If you're receiving this email that means we didn't hear from you from our previous email, so we thought we'd try you again just in case our first email hit your spam or just got lost in your inbox. </p>
        <p>Let's schedule a time to talk about how we can help you with your website request. You can use <a href="https://www.blackwader.com/so/tr/4616408e-b93f-4f1b-8f15-ce86f80c6f45/c?w=xAhODhm5UrAPmwCZUd55xMT8E2cxtartHuL%2FaeiV6DM.eyJ1IjoiaHR0cHM6Ly93d3cuYmxhY2t3YWRlci5jb20vc2VydmljZS1wYWdlL3dlYi1kZXNpZ24taW5xdWlyeT9yZWZlcnJhbD1zZXJ2aWNlX2xpc3Rfd2lkZ2V0IiwiciI6ImQyZjIxZmQyLTcyZmEtNGNkNy1hOTg2LWM2ZWExYWFjYTU2NCIsImMiOiIzZDAyNDY0Zi1mMjQ2LTRmOWUtOTUyZi03ZmViNzdlZjYyOGEiLCJtIjoibWFpbCJ9">this link</a> to book a time for us to connect. We can discuss details <strong>over the phone, through email, or through video conference,</strong> whichever you prefer.</p>
        <p>We offer very competitive & affordable rates, and we also design our projects on the new Wix Studio platform by Wix, so you can rest assured that you are getting the absolute best service for the best price. </p>
        <p>Please schedule a time or simply reply to this email with how we can move forward along with any specifics, and we can go from there! Looking forward to hearing from you. In the meantime feel free to take a look at some of our previous projects, <a href="https://www.blackwader.com/web-design">linked here.</a> </p>
        <p><strong>Btw, this isn't some automated campaign; I promise :)</strong></p>
        <p>Kind Regards,</p>
        --
        ${emailFooter}
    `,
    secondFollowUpSubject: "About Your Wix Project Request",
    secondFollowUpBody: 
        `<p>This is an email letting you know that we've received your project request from Wix however we haven't heard back from you. If you'd like to continue, you can always <a href="https://www.blackwader.com/so/tr/4616408e-b93f-4f1b-8f15-ce86f80c6f45/c?w=xAhODhm5UrAPmwCZUd55xMT8E2cxtartHuL%2FaeiV6DM.eyJ1IjoiaHR0cHM6Ly93d3cuYmxhY2t3YWRlci5jb20vc2VydmljZS1wYWdlL3dlYi1kZXNpZ24taW5xdWlyeT9yZWZlcnJhbD1zZXJ2aWNlX2xpc3Rfd2lkZ2V0IiwiciI6ImQyZjIxZmQyLTcyZmEtNGNkNy1hOTg2LWM2ZWExYWFjYTU2NCIsImMiOiIzZDAyNDY0Zi1mMjQ2LTRmOWUtOTUyZi03ZmViNzdlZjYyOGEiLCJtIjoibWFpbCJ9">schedule a time to speak</a>, call our phone number at <strong>+1 (949) 868-0338 or simply reply to this email</strong>. We'd love your business and would like nothing more than to help out.</p>
        <p>However, if you have already changed your mind about your project, please go ahead and cancel your project request on Wix, so designers and partners alike no longer receive your project request.</p>
        <p>Kind Regards,</p>
        --
        ${emailFooter}
    `,
    finalFollowUpSubject: "Whenever You Are Ready...",
    finalFollowUpBody:
        `<p>This is an email letting you know that even through we received your Wix Marketplace Project request, we still haven't heard from you. We will still keep your project open for you, so whenever you are ready we can move forward. </p>
        <p>However this will be the final follow up email regarding your project that you'll receive from us, when you are ready to move forward feel free to reply to this email.</p>
        <p>Kind Regards,</p>
        --
        ${emailFooter}
    `,
}


module.exports = emailTemplates