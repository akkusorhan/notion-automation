const mongoose = require("mongoose");
const Contact = require("./models/contact")

/**
 * Handle MongoDB POST Request
 */

const saveToMongoDB = (req, res) => {
    const contact = new Contact( {
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
}

module.exports = saveToMongoDB