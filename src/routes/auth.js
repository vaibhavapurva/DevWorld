const express = require("express");
const { validationSignUp } = require("../utils/validationsSignUp");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const userObj = req.body;

  const { firstName, LastName, emailID, password, age, gender, about, skills } =
    req.body;
  // const user = new User(userObj);
  try {
    validationSignUp(req);
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      LastName,
      emailID,
      age,
      gender,
      about,
      skills,
      password: passwordHash,
    });
    await user.save();
    res.send("user data submit");
  } catch (err) {
    res.send("Error " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailID, password } = req.body;
  try {
    const user = await User.findOne({ emailID: emailID });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordvalid = await bcrypt.compare(password, user.password);
    if (isPasswordvalid) {
      const token = await jwt.sign(
        { _id: user._id },
        "THisisDEvWorldApplition1234212",
        { expiresIn: "1h" }
      );
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.json({message: "login Successfully", data: user});
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.send("Error" + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("user logout");
});

authRouter.post("/forgetPasword", async (req, res) => {
  try {
    const { emailID, newPassword } = req.body;
    const user = await User.findOne({ emailID: emailID });
    const isPasswordvalid = await bcrypt.compare(newPassword, user.password);
    if (isPasswordvalid) {
      throw new Error("New Password Match to old one");
    }
    if (user) {
      const passwordHash = await bcrypt.hash(newPassword, 10);
      const users = await User.findByIdAndUpdate(user._id, {
        password: passwordHash,
      });
      res.send("password Update");
    } else {
      throw new Error("Invalid credentialss");
    }
  } catch (err) {
    res.status(400).send("err " + err.message);
  }
});

module.exports = authRouter;
