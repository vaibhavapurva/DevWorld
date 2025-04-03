const express = require("express");
const {userAuth} = require('../middlewares/auth');
const {validationProfileEdit}=  require('../utils/validationsSignUp');
const User = require("../models/user");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();

profileRouter.get("/profile", userAuth,  async (req, res) => {
    try {
      const user =  req.user
      res.json({message: "prfile data", data: user});
    } catch (err) {
      res.status(401).send("Error " + err.message);
    }
  });

profileRouter.patch("/profile/edit", userAuth, async(req, res)=>{
    try{
        if(!validationProfileEdit(req)){
            throw new Error("invalid edit request");
        }
        const {_id} = req.user; 
        const user = await User.findByIdAndUpdate(_id, req.body)
        res.send({message: "profile update", data: user})
    }catch (err) {
        res.status(401).send("Error " + err.message);
      }
})

profileRouter.patch("/password/forget", userAuth, async(req, res) =>{
    try{
        const {_id} = req.user
        const {password, newPassword} = req.body
        const isPasswordvalid = await bcrypt.compare(password, req.user.password);
        if(isPasswordvalid){
            const passwordHash = await bcrypt.hash(newPassword, 10);
            const data = {
                 password:passwordHash,
            }
            const user = await User.findByIdAndUpdate(_id ,data )
            res.send("password change")
        }else{
            throw new Error("Invalid Ca ")
        }

    }catch(err){
        res.status(401).send("Error " + err.message);
    }
})

module.exports = profileRouter;