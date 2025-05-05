const express = require("express");
const Application = require("../models/Application");
const Student = require("../models/Student");
const Job = require("../models/Job");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

// Route: Apply for a job: create new application
router.post("/:jobId/apply", protect, async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const studentId = req.user.id;
        const studentRollnum = req.user.rollnum;

        console.log("Student ID:", studentId, "Job ID:", jobId);

        // Prevent duplicate applications
        const existingApplication = await Application.findOne({ student_id: studentId, job_id: jobId });
        if (existingApplication) {
            return res.status(400).json({ error: "You have already applied to this job." });
        }

        // Create new Application document
        const newApplication = new Application({
            student_id: studentId,
            job_id: jobId,
            approval_status: "Pending" // default
        });
        await newApplication.save();

        res.status(200).json({ message: "Application submitted successfully." });
    } catch (error) {
        console.error("Apply job error:", error);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
});

router.put("/status/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { approval_status } = req.body;

        if (!["Selected", "Rejected"].includes(approval_status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        const updatedStatus = await Application.findByIdAndUpdate(
            id,
            { approval_status },
            { new: true }
        );

        res.json(updatedStatus);
        console.log(`Application ${approval_status}`);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route: Get all applications
router.get("/", async (req, res) => {
    try {
        const applications = await Application.find().populate("student_id").populate("job_id");
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
