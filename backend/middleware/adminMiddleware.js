const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Admin = require("../models/Admin");

const adminProtect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const admin = await Admin.findById(decoded.id).select("-password");
            if (!admin) {
                res.status(401);
                throw new Error("Admin access denied. Admin not found.");
            }
            req.user = admin;
            next();
        } catch (error) {
            console.error("Admin token verification failed:", error.message);
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    } else {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

module.exports = { adminProtect };
