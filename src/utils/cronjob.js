const cron = require("node-cron");
const  {subDays, startOfDay, endOfDay} = require("date-fns");
const ConnectionRequestModel = require("../models/connectionRequest");
const sendEmail = require("./ses_sendemail")

cron.schedule("38 19 * * *", async()=>{
    try{
        const yesterday = subDays( new Date(), 0);
        const yesterdayStart = startOfDay(yesterday)
        const yesterdayEnd = endOfDay(yesterday)

        const pendingRequest = await ConnectionRequestModel.find({
            status: "intersted",
            createdAt : {
                $gte: yesterdayStart,
                $lt : yesterdayEnd
            }
        }).populate("toUserId")
        console.log("pendingRequest",pendingRequest)
        const emailList  = [...new Set(pendingRequest.map((req)=> req.toUserId.emailID))]
        console.log("emailList",emailList)
        for(const email of emailList){
           try{
            const res = await sendEmail.run("connections request update", `${email}hello email  you have recived many friend reuest please login and see`)
            console.log("res",res)
           }catch (err) {
            console.log(err)
           }
        }



    }catch (err) {
        console.log(err)
    }
})