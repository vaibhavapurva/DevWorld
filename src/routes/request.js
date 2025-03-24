const express = require("express");
const { userAuth }= require('../middlewares/auth');
const bcrypt = require("bcrypt");
const requestRouter = express.Router();

requestRouter.post("/scr", userAuth ,(req, res)=>{
   try{
    const user = req.user;
    res.send(user)
   }catch (err) {
    res.status(400).send("err "+ err.message)
   }
})


module.exports = requestRouter;