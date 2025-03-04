import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1hr" })
    res.cookie("jwt", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true, //Prevents XSS attacks
        sameSite: "strict", //Prevents XSRF attacks
        secure: import.meta.env.NODE_ENV !== "development"
    });
    return token;
}

export default generateToken;
