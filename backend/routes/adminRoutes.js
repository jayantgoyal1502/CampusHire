const express = require("express");
const { adminProtect } = require("../middleware/adminMiddleware");
const Admin = require("../models/Admin");
const Job = require("../models/Job");
const Student = require("../models/Student");
const Recruiter = require("../models/Recruiter");
const bcrypt = require("bcryptjs"); // Fixed Import
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

        // Correct password matching
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Return token upon successful login
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
        const { job_type, job_category, job_status } = req.query;

        const query = {};
        if (job_type) query.job_type = job_type;
        if (job_status) query.job_status = job_status;
        if (job_category) query.job_category = job_category;

        const jobs = await Job.find(query);
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all students
router.get("/students", adminProtect, async (req, res) => {
    try {
        const { branch, course, gender, cgpa, placement } = req.query;

        const query = {};
        if (branch) query.branch = branch;
        if (course) query.course = course;

        const students = await Student.find(query).select("-password");
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all recruiters
router.get("/recruiters", adminProtect, async (req, res) => {
    try {
        const { category, participation_type, company_type } = req.query;
        
            const query = {};
            if (category) query.category = category;
            if (participation_type) query.participation_type = participation_type;
            if (company_type) query.company_type = company_type;
        
            const recruiters = await Recruiter.find(query).select("-password");
            res.status(200).json(recruiters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
