const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    LastName: {
        type: String,

    },
    emailID: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min:18
    },
    gender: {
        type: String
    },
    about: {
        type: String,
    },
    skills: {
        type: [String]
    },
    photoURL: {
        type: String,
        default: "https://www.freepik.com/free-photos-vectors/default-user"
    }
})


const User  = mongoose.model('User', userSchema);


module.exports = User;