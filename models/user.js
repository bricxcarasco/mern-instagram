const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    expireTokenDate: Date,
    photo: {
        type: String,
        default: "https://res.cloudinary.com/gss-bricx-carasco/image/upload/v1592118916/default-profile-pic_kwnbgu.png"
    },
    followers: [{
        type: ObjectId,
        ref: 'User'
    }],
    following: [{
        type: ObjectId,
        ref: 'User'
    }]
});

mongoose.model('User', userSchema);