const express = require('express');
const app  = express();



app.use('/',(req, res)=>{
res.send("this is the dashboard page")    
})

app.use('/home',(req, res) =>{
    res.send("app is called")
})

app.use('/text', (req, res)=>{
    res.send("this is text path")
})
app.listen(3000,() =>{
    console.log("Server is successfully listeing on port 3000")
})