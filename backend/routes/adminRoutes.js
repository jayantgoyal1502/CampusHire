const express = require("express");
const { adminProtect } = require("../middleware/adminMiddleware");
const Admin = require("../models/Admin");
const Job = require("../models/Job");
const Student = require("../models/Student");
const Recruiter = require("../models/Recruiter");
const bcrypt = require("bcryptjs"); // ✅ Fixed Import
const generateToken = require("../utils/generateToken");

const router = express.Router();

// Admin Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // ✅ Correct password matching
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // ✅ Return token upon successful login
        res.json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            token: generateToken(admin._id),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all jobs
router.get("/jobs", adminProtect, async (req, res) => {
    try {
        const jobs = await Job.find().populate("company_id", "org_name");
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all students
router.get("/students", adminProtect, async (req, res) => {
    try {
        const students = await Student.find().select("-password");
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all recruiters
router.get("/recruiters", adminProtect, async (req, res) => {
    try {
        const recruiters = await Recruiter.find().select("-password");
        res.json(recruiters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
