const jwt = require('jsonwebtoken')
const User = require('../models/user')


const userAuth = async(req, res, next) =>{
   try{
    const {token} = req.cookies;
    if(!token){
        throw new Error("Invalid token")
    }
    const decodedMessage = await jwt.verify(token, "THisisDEvWorldApplition1234212");
    const {_id} = decodedMessage;
    const user = await User.findById(_id);
    if(!user){
        throw new Error("User Not Found")
    }
    req.user = user
    next()
   }catch (err) {
    res.status(400).send("Error "+err.message)
   }
}


module.exports = {
    userAuth
}