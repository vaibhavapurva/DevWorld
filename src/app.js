const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");


app.use(express.json())

app.post("/signup", async (req, res) => {
  const userObj = req.body 
  const user = new User(userObj);
  try{
    await user.save();
  res.send("user data submit")
  } catch(err) {
    res.status(400).send("Error saving the user", err.message)
  }
});

connectDB()
  .then(() => {
    console.log("database connected done");
    app.listen(3000, () => {
      console.log("Server is successfully listeing on port 3000");
    });
  })
  .catch((err) => {
    console.log("database can not connected now ");
  });

app.use(
  "/user",
  (req, res, next) => {
    console.log("handerling resquest 1");
    // res.send("res 1")
    next();
  },
  (req, res, next) => {
    console.log("handerling 2 req");
    // res.send("res 2")
    next();
  },
  (req, res) => {
    res.send("handerling 3 req");
  }
);

// app.get('/user', (req, res) =>{
//     const data = {
//         name: "vaibhav apurva",
//         age: 24,
//         email: "vaibhavapurvadewas@gmail.com"
//     }
//     res.send(data)
// })
// app.get('/user/:userID/:name/:password', (req, res)=>{
//     console.log(req.params)
// res.send("done bhai")
// })
// app.delete('/user', (req, res) =>{
//     res.send("user was deleted")
// })
// app.post('/user', (req, res) =>{
//     res.send("data will succefull submited");
// })

// app.use('/text', (req, res)=>{
//     res.send("this is text path")
// })
