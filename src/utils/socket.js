const socket = require("socket.io");
const crypto =require("crypto");
const { Chat } = require("../models/chat");

const getSecretRoomId = (userID, targetUserId) =>{
    return crypto.createHash("sha256").update([userID, targetUserId].sort().join("$")).digest("hex")
}


const initializeSocket = async(server) => {
  const io = socket(server, {
    cors: {
      orgin: "http://localhost:5173/",
    },
  });

  io.on("connection",  (socket) => {
    socket.on("joinChat", (userID, targetUserId) => {
      const room = getSecretRoomId(userID, targetUserId);
      console.log("room", room);
      socket.join(room);
    });
    socket.on("sendMessage",async ({firstName,LastName, userId, targetUserId, text}) => {
        try{
            const room =getSecretRoomId(userId, targetUserId);
            let chat = await Chat.findOne({participants: {$all: [userId, targetUserId]}})
            if(!chat){
                chat =  await Chat({
                    participants: [userId, targetUserId],
                    messages: [],
                })
            }

            chat.messages.push({
                senderId: userId,
                text,
            });
            await chat.save();
            io.to(room).emit("messageReceived", {firstName,LastName, text, })
        }catch(err){
            console.log(err)
        }
    });
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
