const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Recruiter = require("../models/Recruiter");

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]; // Extract token

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check if user is a student or recruiter
            req.user = await Student.findById(decoded.id).select("-password") || 
                       await Recruiter.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({ error: "Not authorized, user not found" });
            }

            next();
        } catch (error) {
            res.status(401).json({ error: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ error: "No token, authorization denied" });
    }
};

module.exports = { protect };
