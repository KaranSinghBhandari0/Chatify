const Message = require("../models/message.js");
const {cloudinary} = require("../lib/cloudinary.js");
const { getReceiverSocketId, io } = require('../lib/socket.js');

// sending message
const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body[0];
        const { id } = req.params;
        const receiverId = id;
        const senderId = req.body[1];

        let imageUrl;
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });
        await newMessage.save();

        // real time messaging to receiver
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(200).json(newMessage);
    } catch (error) {
        console.log("Error in sending Message", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// finding all messages related for currUser
const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.body.userId;

        // all messages where i am sender or receiver
        const messages = await Message.find({
            $or: [
            { senderId: myId, receiverId: userToChatId },
            { senderId: userToChatId, receiverId: myId },
        ],
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// clear chat
const clearChat = async (req, res) => {
    try {
        const { receiverId } = req.params;
        const user = req.body;

        if(!user) {
            return res.status(400).json({ error: "Current user is not authenticated." });
        }

        if(!receiverId) {
            return res.status(400).json({ error: "Receiver ID is missing." });
        }

        // Delete chat messages between the current user and the receiver
        await Message.deleteMany({
            $or: [
                { senderId: user.userId, receiverId: receiverId },
                { senderId: receiverId, receiverId: user.userId }
            ]
        });

        res.status(200).json({ message: "Chat deleted successfully" });
    } catch (error) {
        console.error("Error in clearChat controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {getMessages, sendMessage, clearChat}