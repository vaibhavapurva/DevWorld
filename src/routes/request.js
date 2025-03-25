const express = require("express");
const { userAuth } = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const requestRouter = express.Router();
const ConnectionRequestModel = require("../models/connectionRequest");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const AllowedStatus = ["ignored", "intersted"];
      // if(fromUserId.equals(toUserId)){
      //     return res.status(400).json({message: "you can not send connecttion request yourself"})
      // }
      if (!AllowedStatus.includes(status)) {
        return res.status(400).json({ message: "status is not valid" });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({ message: "user not Found" });
      }

      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request Already Exists" });
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message: "connect resquest send Succecfully",
        data,
      });
    } catch (err) {
      res.status(400).send("err " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const requestId = req.params.requestId;
      const loginUser = req.user;
      const status = req.params.status;
      console.log(status);
      const requestData = await ConnectionRequestModel.findOne({
        _id: requestId,
        status: "intersted",
        toUserId: loginUser._id
      });
      if (!requestData) {
        return res.status(400).json({ message: "not found any request" });
      }
      const AllowedStatus = ["accepted", "rejected"];
      if (!AllowedStatus.includes(status)) {
        return res.status(400).json({ message: "status is not valid" });
      }
    //   console.log(requestData.toUserId, loginUser._id);
    //   if (!requestData.toUserId.equals(loginUser._id)) {
    //     return res.status(400).json({ message: "You are not vaild user" });
    //   }
      const data = {
        status: status,
      };
      const aws = await ConnectionRequestModel.findByIdAndUpdate(
        requestId,
        data
      );

      res.json({ message: "done", requestData });
    } catch (err) {
      res.status(400).send("Error" + err.message);
    }
  }
);

module.exports = requestRouter;
