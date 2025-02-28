import cloudinary from "../Lib/cloudinary.js";
import Message from "../Models/message.js";
import Messages from "../Models/message.js";
import User from "../Models/user.js";

const getUserSidebar = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select("-password");
        
        res.status(200).json(filteredUsers)
    } catch (error) { 
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

const getMessages = async (req, res) => {
    try {
        const friendId = req.params.id;        
        const userId = req.user._id;
        
        const messages = await Messages.find({
            $or: [
                { senderId: userId, recieverId: friendId },
                { senderId: friendId, recieverId: userId },
            ]
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

const sendMessages = async (req, res) => {
    try {
        const recieverId = req.params.id;
        const { text, image } = req.body;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        //realtime functionality using socket.io

        res.status(200).json(newMessage);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

export default { getUserSidebar, getMessages, sendMessages };

