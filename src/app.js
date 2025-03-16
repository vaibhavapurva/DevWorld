const express = require('express');
const app  = express();



app.get('/user', (req, res) =>{
    const data = {
        name: "vaibhav apurva",
        age: 24,
        email: "vaibhavapurvadewas@gmail.com"
    }
    res.send(data)
})
app.get('/user/:userID/:name/:password', (req, res)=>{
    console.log(req.params)
res.send("done bhai")
})
app.delete('/user', (req, res) =>{
    res.send("user was deleted")
})
app.post('/user', (req, res) =>{
    res.send("data will succefull submited");
})

app.use('/text', (req, res)=>{
    res.send("this is text path")
})

app.listen(3000,() =>{
    console.log("Server is successfully listeing on port 3000")
})