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
        <p>Please schedule a time, call our phone number at <strong>+1 (949) 868-0338 or simply reply to this email</strong> with how we can move forward along with any specifics, and we can go from there! Looking forward to hearing from you. In the meantime feel free to take a look at some of our previous projects, <a href="https://www.blackwader.com/web-design">linked here</a>. </p>
        <p><strong>Btw, this isn't some automated campaign; I promise :)</strong></p>
        <p>Kind Regards,</p>
        --
        ${emailFooter}
    `,
    seoLeadGeneratedSubject: "Improving Your SEO",
    seoLeadGeneratedBody: 
        `<p>I'm Orhan Akkus, an SEO specialist and Wix Partner. Thank you for reaching out through the Wix Marketplace. I received your request and would love to discuss your SEO project in more detail.</p>
        <p>Let's schedule a time to talk about how we can improve your website's search engine optimization. You can book a time for us to connect using <a href="https://www.blackwader.com/booking-calendar/seo-inquiry?referral=service_list_widget">this link</a>. We can discuss the specifics over the phone, via email, or through a video conference, whichever works best for you.</p>
        <p>We specialize in improving SEO through a comprehensive approach that includes keyword optimization, content creation, backlink building, and technical SEO enhancements. For instance, we recently increased organic (unpaid) website traffic by 2500% for Pathway Therapy Center, leading to more phone calls, leads, scheduled sessions, and significant brand exposure. You can read the full case study <a href="https://www.blackwader.com/seo">here</a>.</p>
        <p>Please schedule a time, call us at <strong>+1 (949) 868-0338, or reply to this email</strong> with any details about your project and we can proceed from there. Looking forward to hearing from you. In the meantime, feel free to learn more about our SEO services <a href="https://www.blackwader.com/seo">here</a>.</p>
        <p><strong>Btw, this isn't some automated campaign; I promise :)</strong></p>
        <p>Kind Regards,</p>
        --
        ${emailFooter}
    `,
    firstFollowBuSubject: "Your Wix Project",
    firstFollowUpBody: 
        `<p>Any updates? We haven't heard back from our previous email, so we thought we'd try you again just in case our first email hit your spam or just got lost in your inbox. </p>
        <p>When you are free, let's schedule a time to talk about how we can help you with your Wix website project. You can <a href="https://www.blackwader.com/so/tr/4616408e-b93f-4f1b-8f15-ce86f80c6f45/c?w=xAhODhm5UrAPmwCZUd55xMT8E2cxtartHuL%2FaeiV6DM.eyJ1IjoiaHR0cHM6Ly93d3cuYmxhY2t3YWRlci5jb20vc2VydmljZS1wYWdlL3dlYi1kZXNpZ24taW5xdWlyeT9yZWZlcnJhbD1zZXJ2aWNlX2xpc3Rfd2lkZ2V0IiwiciI6ImQyZjIxZmQyLTcyZmEtNGNkNy1hOTg2LWM2ZWExYWFjYTU2NCIsImMiOiIzZDAyNDY0Zi1mMjQ2LTRmOWUtOTUyZi03ZmViNzdlZjYyOGEiLCJtIjoibWFpbCJ9">book a time here</a>, call our phone number at <strong>+1 (949) 868-0338 or reply to this email</strong>.</p>
        <p>You can also take a look at our recent projects through <a href="https://www.blackwader.com/web-design">this link</a>. Let me know if you have any questions :) </p>
        <p>Kindly,</p>
        --
        ${emailFooter}
    `,
    secondFollowUpSubject: "Your Wix Project",
    secondFollowUpBody: 
        `<p>This is an email letting you know that we've received your project request from Wix however we haven't heard back from you. If you'd like to continue, you can always <a href="https://www.blackwader.com/so/tr/4616408e-b93f-4f1b-8f15-ce86f80c6f45/c?w=xAhODhm5UrAPmwCZUd55xMT8E2cxtartHuL%2FaeiV6DM.eyJ1IjoiaHR0cHM6Ly93d3cuYmxhY2t3YWRlci5jb20vc2VydmljZS1wYWdlL3dlYi1kZXNpZ24taW5xdWlyeT9yZWZlcnJhbD1zZXJ2aWNlX2xpc3Rfd2lkZ2V0IiwiciI6ImQyZjIxZmQyLTcyZmEtNGNkNy1hOTg2LWM2ZWExYWFjYTU2NCIsImMiOiIzZDAyNDY0Zi1mMjQ2LTRmOWUtOTUyZi03ZmViNzdlZjYyOGEiLCJtIjoibWFpbCJ9">schedule a time to speak</a>, call our phone number at <strong>+1 (949) 868-0338 or simply reply to this email</strong>. We'd love your business and would like nothing more than to help out.</p>
        <p>However, if you have already changed your mind about your project, please go ahead and cancel your project request on Wix, so designers and partners alike no longer receive your project request.</p>
        <p>Kindly,</p>
        --
        ${emailFooter}
    `,
    finalFollowUpSubject: "Your Wix Project",
    finalFollowUpBody:
        `<p>This is an email letting you know that even through we received your Wix Marketplace Project request, we still haven't heard from you. Your project will remain open for you, so whenever you are ready we can still move forward. </p>
        <p>However this will be the final follow up email regarding your project that you'll receive from us, so if you are ready to move forward anytime in the future feel free to reply to this email.</p>
        <p>Kind Regards,</p>
        --
        ${emailFooter}
    `,
}


module.exports = emailTemplates