const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loginUserId = req.user._id;
    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loginUserId,
      status: "intersted",
    }).populate("fromUserId", ["firstName", "LastName", "photoURL","skills",'age', 'gender']);
    console.log("connectionRequest", connectionRequest);
    if (connectionRequest.length < 0) {
      return res.status(400).json({ message: "No Connection Request Found" });
    }

    res.json({ message: "connection request found", connectionRequest });
  } catch (err) {
    res.status(400).send("Err" + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loginuser = req.user;
    const connections = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loginuser._id, status: "accepted" },
        { fromUserId: loginuser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "LastName",
        "photoURL",
        "about",
        "skills",
      ])
      .populate("toUserId", [
        "firstName",
        "LastName",
        "photoURL",
        "about",
        "skills",
      ]);
    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loginuser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ message: "connection data", data : data});
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) ||1;
    let limit = parseInt(req.query.limit) ||5;
    limit = limit > 50 ? 50: limit;
    const skip = (page-1) *limit;

    const connectionsRequest = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideConnectionsFeed = new Set();

    connectionsRequest.forEach((req) => {
      hideConnectionsFeed.add(req.fromUserId.toString());
      hideConnectionsFeed.add(req.toUserId.toString());
    });

    const data = await User.find({
      _id: { $nin: Array.from(hideConnectionsFeed) },
    }).select(["firstName", "LastName", "photoURL", "about", "skills"]).skip(skip).limit(limit);

    const userData = await User.find();

    res.send({ message: "feed data", data });
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

module.exports = userRouter;
