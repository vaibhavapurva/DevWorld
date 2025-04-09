const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const paymentInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const User = require("../models/user");
const membershipType = require("../utils/constants");
const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
    console.log("hello world")
    console.log("check",req.user.firstName,req.user.LastName,req )
  try {
    const order = await paymentInstance.orders.create({
      amount: 70000,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName: req.user.firstName,
        LastName: req.user.LastName,
        emailID: req.user.emailID,
        membershipTyoe: req.body.type,
      },
    });
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes, 
    });
    const paymentSaved = await payment.save();
    console.log("paymenet call", paymentSaved);
    res.json({ ...paymentSaved.toJSON(), keyId :  process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(400).send("Error" + err.message);
    console.log(err);
  }
});


paymentRouter.post("/payment/webhook",async (req, res) =>{
    try{
        console.log("webhooks1")
        const webhookSignature = req.get("X-Razorpay-Signature");
        const isWebhookValid = validateWebhookSignature(
            JSON.stringify(req.body),
            webhookSignature,
            "WebHook@1221"
        );
        console.log("webhooks2",isWebhookValid)
        if(!isWebhookValid){
            return res.status(400).json({msg:"Webhook signature is invalid"})
        }
    
        const paymentDetails = req.body.payload.payment.entity;
        const payment = await Payment.findOne({orderId: paymentDetails.order_id})
        payment.status = paymentDetails.status;
        console.log("webhooks",payment)
        await payment.save();

        const user = await User.findOne({_id : payement.userId});
        user.isPremium = true;
        user.membershipType= payment.notes.membershipType
        await user.save()

        if(req.body.event === "payment.captured"){
    
        }
        if(req.body.event === "payment.failed"){
            
        }
        return res.status(200).json({ msg: "webhook received successfully"})
    }
    catch (err){
        return res.status(500).json({msg: err.message})
    }
})

paymentRouter.get("/premium/verify", userAuth, async (req, res) =>{
    try{
        if(req.user.isPremium){
            res.status(200).json({msg: "user is premium", isPremium: true });
        }else{
            res.status(200).json({msg: "user is not premium", isPremium: false });
        }

    }catch(err){
        res.status(400).send("Error" + err.message);
        console.log(err);
    }
})

module.exports = paymentRouter;

