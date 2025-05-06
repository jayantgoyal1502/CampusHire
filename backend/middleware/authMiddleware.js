const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Recruiter = require("../models/Recruiter");

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const student = await Student.findById(decoded.id).select("-password");
            const recruiter = await Recruiter.findById(decoded.id).select("-password");

            req.user = student || recruiter;

            if (!req.user) {
                return res.status(401).json({ error: "Not authorized, user not found" });
            }

            req.user.role = student ? "student" : "recruiter";

            next();
        } catch (error) {
            res.status(401).json({ error: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ error: "No token, authorization denied" });
    }
};

// middleware to restrict to recruiters only
const authorizeRecruiter = (req, res, next) => {
    if (req.user.role !== "recruiter") {
        return res.status(403).json({ error: "Access denied: Recruiters only" });
    }
    next();
};

module.exports = { protect, authorizeRecruiter };
