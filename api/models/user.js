const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
        type: Date,
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
    verificationToken: String
})

const User = mongoose.model('User', userSchema)

module.exports = User