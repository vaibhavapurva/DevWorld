const mongoose = require('mongoose')
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minLength: 4,
        maxLength: 50,
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
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Email id is not valid "+ value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)){
                throw new Error("please eneter a storng Password ", +value)
            }
        }
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
},{
    timestamps: true
}
)


const User  = mongoose.model('User', userSchema);


module.exports = User;