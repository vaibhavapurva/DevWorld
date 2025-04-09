const mongoose = require('mongoose')

const connectDB = async ()  =>{
    console.log("======",process.env.DB_CONNECTION_SECRET)
    await mongoose.connect(process.env.DB_CONNECTION_SECRET)
}

module.exports = connectDB;

// connectDB().then(() =>{
//     console.log("database connected done  ")
// }).catch((err) =>{
//     console.log("database can not connected now ")
// })  