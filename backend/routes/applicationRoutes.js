const express = require("express");
const Application = require("../models/Application");
const Student = require("../models/Student");
const Job = require("../models/Job");
const router = express.Router();
const { protect, authorizeRecruiter } = require("../middleware/authMiddleware");

// Route: Get all applications
router.get("/", protect, async (req, res) => {
    try {
        const applications = await Application.find().populate("student_id").populate("job_id");
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:jobId/applicants", protect, async (req, res) => {
    // Controller to fetch a job with its applicants from Application model
    const { jobId } = req.params;

    try {
        const applications = await Application.find({ job_id: jobId })
            .populate('student_id', 'name email') // populate student name and email only
            .lean();

        res.status(200).json(applications.map(app => ({
            _id: app._id,
            name: app.student_id?.name || "Unknown",
            student_id: app.student_id?._id || null,
            email: app.student_id?.email || "Unknown",
            status: app.approval_status,
            appliedAt: app.appliedAt
        })));
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Server error" });
    }
});

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

router.put("/update/status", protect, authorizeRecruiter, async (req, res) => {
    try {
        const { student_id, job_id, approval_status } = req.body;

        console.log("PUT /status/:id called");

        if (!["Selected", "Rejected"].includes(approval_status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        const updatedStatus = await Application.findOneAndUpdate(
            { student_id, job_id },
            { approval_status },
            { new: true }
        );

        if (!updatedStatus) {
            return res.status(404).json({ error: "Application not found" });
        }

        if (approval_status === "Selected") {
            const job = await Job.findById(job_id).lean();
            if (!job) return res.status(404).json({ error: "Job not found" });

            const jobType = job.job_type; // "Internship", "PPO", "Full-Time"
            const updateField = {};

            if (jobType === "Internship") updateField.internship_offer_status = "Selected";
            else if (jobType === "PPO") updateField.ppo_offer_status = "Selected";
            else if (jobType === "Full-Time") updateField.fulltime_offer_status = "Selected";

            await Student.findByIdAndUpdate(student_id, updateField);
        }

        res.json(updatedStatus);
        console.log(`Application ${approval_status} for student ${student_id}`);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;