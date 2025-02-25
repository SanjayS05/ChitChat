import User from "../Models/user.js";
import bcrypt from "bcryptjs";
import generateToken from "../Lib/utils.js";
import cloudinary from "../Lib/cloudinary.js";

const register = async (req, res) => {
    try {
        const { email, fullname, password } = req.body;

        if (!email || !fullname || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        const isEmailExist = await User.findOne({ email });
        if(isEmailExist){
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ email, fullname, password: hashedPassword });
        if (newUser) {  
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(200).json({
                _id: newUser._id,
                email: newUser.email,
                fullname: newUser.fullname,
                profilePicture: newUser.profilePicture,
            });
        }else{
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid Password" });
        }
        else {
            generateToken(user._id, res);
            res.status(200).json({
                _id: user._id,
                email: user.email,
                fullname: user.fullname,
                profilePicture: user.profilePicture,
            });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

const logout = async (req, res) => {
    try {   
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out Successfully" })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required" });
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePicture: uploadResponse.secure_url }, { new: true });

        res.status(200).json(updatedUser)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
}

const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Check Auth error"+error.message);
        res.status(500).json({ message: error.message });
    }
}

export default { register, login, logout, updateProfile, checkAuth };
