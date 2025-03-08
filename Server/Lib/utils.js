import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1hr" })
    res.cookie("jwt", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true, // Prevents XSS attacks
        sameSite: "none", // Required for cross-origin cookies
        secure: true // Required for cross-origin cookies
    });
    return token;
}

export default generateToken;
