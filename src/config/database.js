const mongoose = require('mongoose')

const connectDB = async ()  =>{
    await mongoose.connect("mongodb+srv://happynode:w1sMoO51aplDjdhU@happynode.gw7p4.mongodb.net/devworld")
}

module.exports = connectDB;

// connectDB().then(() =>{
//     console.log("database connected done  ")
// }).catch((err) =>{
//     console.log("database can not connected now ")
// })  