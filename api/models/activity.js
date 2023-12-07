const mongoose = require('mongoose')

const ActivitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: true
    },
    image: String,
    date: Date,
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
})

const Activity = mongoose.model("Activity", ActivitySchema)

module.exports = Activity