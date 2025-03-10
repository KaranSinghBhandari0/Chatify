const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: String,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
    },
    image: {
        type: String,
    },
},
{ timestamps: true });

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;