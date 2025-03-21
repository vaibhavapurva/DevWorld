const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");


app.use(express.json())

app.get('/user', async (req, res) =>{
    const email = req.body.emailID
    // const user = await User.find({emailID : email})
    try{
        const users = await User.find({emailID : email})
        if(users.length > 0){
            res.send(users)
        }else{
            res.status(404).send("user data not found")
        }
    }catch(err) {
        res.status(400).send("somthing want worng")
    }
})

app.get('/feed', async (req, res)=>{
try{
    const users = await User.find({});
    if(users.length > 0){
        res.send(users)
    }else{
        res.status(404).send("user data not found")
    }
}catch(err) {
        res.status(400).send("somthing want worng")
    }
})
app.post("/signup", async (req, res) => {
  const userObj = req.body 
  const user = new User(userObj);
  console.log(userObj)
  try{
    await user.save();
    res.send("user data submit")
  } catch(err) {
    res.send("Error saving the user" +err.message)
    console.log(err.message)
  }
});

app.delete("/user", async (req, res) =>{
    const userID = req.body.userId
    try{
        const users  = await User.findByIdAndDelete(userID)
        res.send("user deleted susscesfully")
    }catch(err) {
        res.status(401).send("Error saving the user", err.message)
    }
})

app.patch("/user/:userID", async (req, res) =>{
  const userID = req.params?.userID
    const data = req.body
    try{
        const ALLOWED_UPDATES = ['firstName','LastName', 'password', 'age', 'gender', 'about', 'skills', 'photoURL']
        const isUpdatedAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if(!isUpdatedAllowed){
          throw new Error("update not allowed")
        }
        if(data.skills.length > 20) {
          throw new Error("skill can not added more then 20")
        }
        const users = await User.findByIdAndUpdate(userID, data)
        res.send("user data updated successfully");
    }catch(err){
        res.status(401).send("Error saving the user" + err.message)
    }
})

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
