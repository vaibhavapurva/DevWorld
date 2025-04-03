const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        toUserId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        status:{
            type: String,
            enum:{
                values: ['ignored', 'intersted', 'accepted', 'rejected'],
                message: `{VALUE} is incorrect status type`
            },
            required: true
        },
        fromUserName: {
            type: String,
            required: true
        }
    },
    {timestamps: true}
)

connectionRequestSchema.pre("save", function (next){
    const connectionRequest= this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("you can nto send connection request your self")
    }
    next()
})

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1})
const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequestModel", connectionRequestSchema
)

module.exports = ConnectionRequestModel;