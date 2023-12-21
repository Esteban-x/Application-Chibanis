const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false,
    },
    firstname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
    },
    age: {
        type: Number,
        required: true,
    },
    birthday: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    },
    lastMessage: {
        type: String,
    },
    lastMessageTime: {
        type: Date,
        default: Date.now,
    },
    verificationToken: String
})

const User = mongoose.model('User', userSchema)

module.exports = User