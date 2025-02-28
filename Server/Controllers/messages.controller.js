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
            console.log("Image data received, length:", image.length);
            
            if (!image.startsWith('data:image/')) {
                throw new Error('Invalid image format. Must be a valid base64 image.');
            }

            try {
                console.log("Attempting to upload image to Cloudinary...");
                const uploadResponse = await cloudinary.uploader.upload(image, {
                    resource_type: "auto",
                    folder: "chat_app"
                });
                console.log("Upload successful, URL:", uploadResponse.secure_url);
                imageUrl = uploadResponse.secure_url;
            } catch (cloudinaryError) {
                console.error("Cloudinary upload error:", cloudinaryError);
                throw new Error(`Failed to upload image: ${cloudinaryError.message}`);
            }
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image: imageUrl
        });

        await newMessage.save();
        console.log("Message saved successfully. Full message:", JSON.stringify(newMessage, null, 2));

        res.status(200).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessages:", error);
        res.status(500).json({ 
            message: error.message || "Failed to send message",
            error: error.toString()
        });
    }
}

export default { getUserSidebar, getMessages, sendMessages };

