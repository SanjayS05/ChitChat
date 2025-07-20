import User from "../Models/user.js";
import bcrypt from "bcryptjs";
import generateToken from "../Lib/utils.js";
import cloudinary from "../Lib/cloudinary.js";
import logger from "../Lib/logger.js";

const register = async (req, res) => {
    try {
        const { email, fullname, password } = req.body;
        
        if (!email || !fullname || !password) {
            logger.warn('Registration Attempt - Missing Fields', { email });
            return res.status(400).json({ message: "All fields are required" });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            logger.warn('Registration Attempt - Invalid Password Format', { email });
            return res.status(400).json({ 
                message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)" 
            });
        }

        const isEmailExist = await User.findOne({ email });
        if(isEmailExist){
            logger.warn('Registration Attempt - Email Already Exists', { email });
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ 
            email: email.trim().toLowerCase(), 
            fullname: fullname.trim(), 
            password: hashedPassword 
        });

        if (newUser) {  
            generateToken(newUser._id, res);
            await newUser.save();
            logger.info('User Registration Successful', {
                userId: newUser._id,
                email: newUser.email,
                ip: req.ip
            });
            res.status(200).json({
                _id: newUser._id,
                email: newUser.email,
                fullname: newUser.fullname,
                profilePicture: newUser.profilePicture,
            });
        } else {
            logger.error('Registration Failed - Invalid User Data', { email });
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        logger.error('Registration Error', {
            error: error.message,
            email: req.body.email,
            ip: req.ip
        });
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            logger.warn('Login Attempt - User Not Found', { email, ip: req.ip });
            return res.status(400).json({ message: "User not found" });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            logger.warn('Login Attempt - Invalid Password', { userId: user._id, ip: req.ip });
            return res.status(400).json({ message: "Invalid Password" });
        }
        else {
            generateToken(user._id, res);
            logger.info('Login Successful', {
                userId: user._id,
                email: user.email,
                ip: req.ip
            });
            res.status(200).json({
                _id: user._id,
                email: user.email,
                fullname: user.fullname,
                profilePicture: user.profilePicture,
            });
        }
    } catch (error) {
        logger.error('Login Error', {
            error: error.message,
            email: req.body.email,
            ip: req.ip
        });
        res.status(500).json({ message: error.message });
    }
};

const logout = async (req, res) => {
    try {   
        res.cookie("jwt", "", { maxAge: 0 });
        logger.info('User Logout', {
            userId: req.user._id,
            email: req.user.email,
            ip: req.ip
        });
        res.status(200).json({ message: "Logged out Successfully" })
    } catch (error) {
        logger.error('Logout Error', {
            error: error.message,
            userId: req.user._id,
            ip: req.ip
        });
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            logger.warn('Profile Update Attempt - Missing Profile Picture', { userId });
            return res.status(400).json({ message: "Profile picture is required" });
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePicture: uploadResponse.secure_url }, { new: true });

        logger.info('Profile Update Successful', {
            userId,
            updatedFields: ['profilePicture']
        });
        res.status(200).json(updatedUser)
    } catch (error) {
        logger.error('Profile Update Error', {
            error: error.message,
            userId: req.user._id
        });
        res.status(500).json({ message: error.message });
    }
}

const checkAuth = (req, res) => {
    try {
        logger.debug('Auth Check', {
            userId: req.user._id,
            email: req.user.email
        });
        res.status(200).json(req.user);
    } catch (error) {
        logger.error('Auth Check Error', {
            error: error.message,
            userId: req.user._id
        });
        res.status(500).json({ message: error.message });
    }
}

export default { register, login, logout, updateProfile, checkAuth };
