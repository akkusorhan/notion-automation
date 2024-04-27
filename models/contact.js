const mongoose = require("mongoose");
require("mongoose-type-email")

const contactSchema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    data: {
        firstName: { type: String },
        lastName: { type: String },
        email: { type: String },
        phone: { type: String },
        service: { type: String },
        location: { type: String },
        website: { type: String },
        additionalInfo: { type: String },
        source: { type: String }
    }
}, { collection: "notion-automation" })

module.exports = mongoose.model("Contact", contactSchema)