const express = require("express");
const connectDB = require("./config/database");
var cors = require('cors');
const http = require("http");
const app = express();
require('dotenv').config();
require('./utils/cronjob');
const cookieParser = require("cookie-parser");
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");

app.use(cors({
  orgin:"http://localhost:5173/",
  credentials: true,
}))
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/",profileRouter);
app.use("/", requestRouter)
app.use("/", userRouter)
app.use("/", paymentRouter);
app.use("/",chatRouter);
const server = http.createServer(app);
initializeSocket(server)


connectDB()
  .then(() => {
    console.log("database connected done");
    server.listen(process.env.PORT, () => {
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
