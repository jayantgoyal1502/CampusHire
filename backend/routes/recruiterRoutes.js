const express = require("express");
const Recruiter = require("../models/Recruiter");
const generateToken = require("../utils/generateToken");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Route: Register a new recruiter
router.post("/register", async (req, res) => {
    try {
        const { contact_email } = req.body;

        const existingRecruiter = await Recruiter.findOne({ contact_email });
        if (existingRecruiter) {
            return res.status(400).json({ error: "Recruiter already exists" });
        }

        const recruiter = new Recruiter(req.body);
        await recruiter.save();

        res.status(201).json({
            _id: recruiter._id,
            org_name: recruiter.org_name,
            contact_email: recruiter.contact_email,
            token: generateToken(recruiter._id),
            message: "Company registered successfully!"
        });
    } catch (error) {
        console.error("Error in Registration:", error.message);
        res.status(400).json({ error: error.message });
    }
});

// Route: Recruiter login
router.post("/login", async (req, res) => {
    try {
        const { contact_email, password } = req.body;

        const recruiter = await Recruiter.findOne({ contact_email });

        if (recruiter && (await recruiter.matchPassword(password))) {
            res.json({
                _id: recruiter._id,
                org_name: recruiter.org_name,
                contact_email: recruiter.contact_email,
                token: generateToken(recruiter._id),
            });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Protected Route: Get Recruiter Profile
router.get("/profile", protect, async (req, res) => {
    res.json(req.user);
});

// Protected Route: Get all recruiters (Only for authenticated users)
router.get("/", protect, async (req, res) => {
    try {
        const recruiters = await Recruiter.find().select("-password"); // Exclude password
        res.json(recruiters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
