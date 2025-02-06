const express = require("express");
const Job = require("../models/Job");
const { protect } = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

// 🔒 Create a job posting (Only recruiters)
router.post("/create", protect, async (req, res) => {
    try {
        console.log("Authenticated User:", req.user);

        if (!req.user || !req.user.org_name) {
            console.log("Recruiter Check Failed: User is missing org_name");
            return res.status(403).json({ error: "Access denied. Only recruiters can post jobs." });
        }

        const job = new Job({ ...req.body, company_id: req.user._id });
        await job.save();
        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 🔒 Get all job postings (Authenticated users)
router.get("/", protect, async (req, res) => {
    try {
        const jobs = await Job.find().populate("company_id", "org_name");
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔒 Get jobs posted by the logged-in recruiter
router.get("/recruiter", protect, async (req, res) => {
    try {
        if (!req.user || !req.user.org_name) {
            return res.status(403).json({ error: "Access denied. Only recruiters can view their jobs." });
        }

        const jobs = await Job.find({ company_id: req.user._id });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔒 Apply for a job (Students only) + Email Notifications
router.post("/:jobId/apply", protect, async (req, res) => {
    try {
        if (!req.user || !req.user.name) {
            return res.status(403).json({ error: "Access denied. Only students can apply for jobs." });
        }

        const job = await Job.findById(req.params.jobId).populate("company_id", "contact_email org_name");
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }

        // Prevent duplicate applications
        if (req.user.applied_jobs.includes(job._id)) {
            return res.status(400).json({ error: "You have already applied for this job." });
        }

        // Add job to student's applied list
        req.user.applied_jobs.push(job._id);
        await req.user.save();

        // Send confirmation email to student
        await sendEmail(
            req.user.email,
            "Application Confirmation - CampusHire",
            `You have successfully applied for the job: ${job.job_title} at ${job.company_id.org_name}.`
        );

        // Send notification email to recruiter
        await sendEmail(
            job.company_id.contact_email,
            "New Job Application - CampusHire",
            `${req.user.name} has applied for the job: ${job.job_title}. Check the CampusHire portal for details.`
        );

        res.json({ message: "Successfully applied for the job!" });
    } catch (error) {
        console.error("Error applying for job:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// 🔒 Edit a job posting (Only recruiters)
router.put("/:jobId", protect, async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) return res.status(404).json({ error: "Job not found" });

        if (job.company_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Unauthorized to edit this job" });
        }

        Object.assign(job, req.body);
        await job.save();

        res.json({ message: "Job updated successfully", job });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔒 Delete a job posting (Only recruiters)
router.delete("/:jobId", protect, async (req, res) => {
    try {
        console.log("Job Deletion Request:", req.params.jobId);
        console.log("Authenticated User:", req.user);

        const job = await Job.findById(req.params.jobId);
        if (!job) {
            console.log("Job Not Found");
            return res.status(404).json({ error: "Job not found" });
        }

        if (job.company_id.toString() !== req.user._id.toString()) {
            console.log("Unauthorized Delete Attempt");
            return res.status(403).json({ error: "Unauthorized to delete this job" });
        }

        await job.deleteOne();
        console.log("Job Deleted Successfully");
        res.json({ message: "Job deleted successfully" });
    } catch (error) {
        console.error("Error deleting job:", error.message);
        res.status(500).json({ error: "Internal Server Error: " + error.message });
    }
});

// 🔒 Get Applied Jobs for a Student
router.get("/students/applied-jobs", protect, async (req, res) => {
    try {
        if (!req.user || !req.user.name) {
            return res.status(403).json({ error: "Access denied. Only students can view applied jobs." });
        }
        res.json(req.user.applied_jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
