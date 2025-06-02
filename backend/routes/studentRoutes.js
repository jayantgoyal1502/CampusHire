const express = require("express");
const Student = require("../models/Student");
const Application = require("../models/Application");
const generateToken = require("../utils/generateToken");
const { protect } = require("../middleware/authMiddleware");

const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configure Multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../uploads/resumes")); // ensures cross-platform compatibility
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + file.originalname;
        cb(null, uniqueSuffix);
    },
});

const upload = multer({ storage });

// Route to register student with resumes
router.post("/register", upload.array("resumes"), async (req, res) => {
    try {
        const { rollnum, password, name, resumesMeta, cgpa, branch, phone, email, course, graduation_year } = req.body;

        if (!rollnum || !password || !name || !resumesMeta || !cgpa || !branch || !course || !graduation_year || !phone || !email) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const existingStudent = await Student.findOne({ rollnum });
        if (existingStudent) {
            return res.status(400).json({ error: "Student already exists" });
        }
        // Parse metadata
        let parsedMeta;
        try {
            parsedMeta = JSON.parse(resumesMeta); // should be array of { category }
        } catch (err) {
            return res.status(400).json({ error: "Invalid resumesMeta format" });
        }

        // Validate lengths
        if (!Array.isArray(parsedMeta) || parsedMeta.length !== req.files.length) {
            return res.status(400).json({ error: "Mismatch between files and metadata" });
        }

        // Build resumes array
        const resumes = req.files.map((file, index) => {
            const safeFileName = file.filename.replace(/\s+/g, '-');
            return {
                category: parsedMeta[index]?.category || "General",
                resume_url: `${req.protocol}://${req.get("host")}/uploads/resumes/${safeFileName}`,
            };
        });

        // Create student
        const student = new Student({
            rollnum,
            password,
            name,
            resumes,
            cgpa,
            branch,
            phone,
            email,
            course,
            graduation_year,
        });

        await student.save();

        res.status(201).json({
            _id: student._id,
            name: student.name,
            rollnum: student.rollnum,
            token: generateToken(student._id),
            message: "Student registered successfully!"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Student login
router.post("/login", async (req, res) => {
    try {
        const { rollnum, password } = req.body;

        const student = await Student.findOne({ rollnum });

        if (student && (await student.matchPassword(password))) {
            res.json({
                _id: student._id,
                name: student.name,
                rollnum: student.rollnum,
                token: generateToken(student._id),
            });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Protected Route: Get Student Profile
router.get("/profile", protect, async (req, res) => {
    try {
        const student = await Student.findById(req.user._id).select("-password");

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Protected Route: Get all students (Only for authenticated users)
router.get("/", protect, async (req, res) => {
    try {
        const students = await Student.find().select("-password");
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Applied Jobs for a Student
router.get("/applied-jobs", protect, async (req, res) => {
    try {
        const studentId = req.user._id;

        const applications = await Application.find({ student_id: studentId })
            .populate({
                path: "job_id",
                populate: { path: "company_id", select: "org_name" }
            });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const CategoryEnum = ["Software", "Engineering", "Finance", "Other"];  // Enum values for category
const fs = require("fs");

router.put("/update-profile", protect, upload.array("resumes"), async (req, res) => {
    try {
        if (!req.user || !req.user.name) {
            return res.status(403).json({ error: "Access denied. Only students can edit profile." });
        }

        const student = await Student.findById(req.user._id);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        const { phone, cgpa, resumesMeta } = req.body;
        if (phone) student.phone = phone;
        if (cgpa) student.cgpa = cgpa;

        if (req.files && resumesMeta) {
            const parsedMeta = JSON.parse(resumesMeta);

            req.files.forEach((file, index) => {
                const meta = parsedMeta[index];
                if (!meta || !meta.category) {
                    throw new Error("Category missing for some resumes");
                }

                // Validate category against the enum
                if (!CategoryEnum.includes(meta.category)) {
                    throw new Error(`Invalid category: ${meta.category}. Allowed categories are: ${CategoryEnum.join(", ")}`);
                }

                // Check if resume for this category already exists
                const existingIndex = student.resumes.findIndex(
                    (resume) => resume.category === meta.category
                );

                // If exists, delete old file
                if (existingIndex !== -1) {
                    const oldResumeUrl = student.resumes[existingIndex].resume_url;
                    const oldFilename = oldResumeUrl.split("/").pop(); // Get just the filename
                    const oldFilePath = path.join(__dirname, "..", "uploads", "resumes", oldFilename);

                    // Delete old file from disk
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }

                    // Remove from student.resume array
                    student.resumes.splice(existingIndex, 1);
                }

                // Add new resume
                const resumeUrl = `${req.protocol}://${req.get("host")}/uploads/resumes/${file.filename}`;
                student.resumes.push({
                    category: meta.category,
                    resume_url: resumeUrl
                });
            });
        }

        await student.save({ validateBeforeSave: false });

        res.json({ message: "Profile updated successfully", student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
