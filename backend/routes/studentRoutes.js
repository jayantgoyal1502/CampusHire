const express = require("express");
const Student = require("../models/Student");
const generateToken = require("../utils/generateToken");
const { protect } = require("../middleware/authMiddleware");

const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/resumes"); // Store resumes in 'uploads/resumes'
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user._id}_${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed!"));
        }
    },
});

// 🔒 API to Upload Resume
router.post("/upload-resume", upload.single("resume"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const student = await Student.findById(req.user._id);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Save the resume URL to the database
        student.resume_url = `/uploads/resumes/${req.file.filename}`;
        await student.save();

        res.json({ fileUrl: student.resume_url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Register a new student
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if student already exists
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ error: "Student already exists" });
        }

        // Create new student
        const student = new Student(req.body);
        await student.save();

        res.status(201).json({
            _id: student._id,
            name: student.name,
            email: student.email,
            token: generateToken(student._id),
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Student login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const student = await Student.findOne({ email });

        if (student && (await student.matchPassword(password))) {
            res.json({
                _id: student._id,
                name: student.name,
                email: student.email,
                token: generateToken(student._id),
            });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔒 Protected Route: Get Student Profile
router.get("/profile", protect, async (req, res) => {
    res.json(req.user);
});

// 🔒 Protected Route: Get all students (Only for authenticated users)
router.get("/", protect, async (req, res) => {
    try {
        const students = await Student.find().select("-password");
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔒 Get Applied Jobs for a Student
router.get("/applied-jobs", protect, async (req, res) => {
    try {
        if(!req.user || !req.user.name) {
            return res.status(403).json({ error: "Access denied. Only students can view applied jobs." });
        }
        res.json(req.user.applied_jobs);
    } catch (error){
        res.status(500).json({error: error.message });
    }
});


// Edit Student Profile
router.put("/update-profile", protect, async (req, res) => {
    try {
        if (!req.user || !req.user.name) {
            return res.status(403).json({ error: "Access denied. Only students can edit profile." });
        }

        const student = await Student.findById(req.user._id);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        const { phone, cgpa, resume_url } = req.body;
        if (phone) student.phone = phone;
        if (cgpa) student.cgpa = cgpa;
        if (resume_url) student.resume_url = resume_url;

        await student.save();
        res.json({ message: "Profile updated successfully", student });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
