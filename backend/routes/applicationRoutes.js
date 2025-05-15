const express = require("express");
const mongoose = require("mongoose");
const Application = require("../models/Application");
const Student = require("../models/Student");
const Job = require("../models/Job");
const router = express.Router();
const { protect, authorizeRecruiter } = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendEmail");

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
            rollnum: app.student_rollnum || "N/A",
            course: app.student_course || "N/A",
            branch: app.student_branch || "N/A",
            cgpa: app.student_cgpa || "N/A",
            resumeCategory: app.selected_resume?.category || "N/A",
            resumeUrl: app.selected_resume?.resume_url || null,
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
        const resumeIndex = req.body.resumeIndex;

        const job = await Job.findById(jobId).populate("company_id", "contact_email org_name");
        if (!job) {
            console.log("Job not found");
            return res.status(404).json({ error: "Job not found." });
        }

        const student = await Student.findById(studentId);
        if (!student) {
            console.log("Student not found");
            return res.status(404).json({ error: "Student not found." });
        }

        if (student.hasOfferFor(job.job_type)) {
            console.log("Already has offer for this job type");
            return res.status(400).json({ error: `Already selected for a ${job.job_type} job.` });
        }

        const existingApplication = await Application.findOne({ student_id: studentId, job_id: jobId });
        if (existingApplication) {
            console.log("Already applied");
            return res.status(400).json({ error: "You have already applied to this job." });
        }

        const selectedResume = student.resumes?.[parseInt(resumeIndex)];
        if (!selectedResume) {
            return res.status(400).json({ error: "Invalid resume selected." });
        }

        // Save application
        const newApplication = new Application({
            student_id: studentId,
            student_rollnum: student.rollnum,
            student_name: student.name,
            student_email: student.email,
            student_course: student.course,
            student_branch: student.branch,
            student_cgpa: student.cgpa,
            job_id: jobId,
            org_name: job.org_name,
            job_title: job.job_title,
            approval_status: "Pending",
            selected_resume: {
                resume_url: selectedResume.resume_url,
                category: selectedResume.category
            }
        });

        await newApplication.save();
        console.log("New application saved");

        // Update Student
        student.applied_jobs.push(jobId);
        await Student.updateOne(
            { _id: studentId },
            { $push: { applied_jobs: jobId } }
        );
        console.log("Student updated with applied job");

        // Update Job
        job.applicants.push(studentId);
        await Job.updateOne(
            { _id: jobId },
            { $push: { applicants: studentId } }
        );

        console.log("Job updated with new applicant");

        // Emails
        await sendEmail(
            student.email,
            "Application Confirmation - CampusHire",
            `You have successfully applied for the job: ${job.job_title} at ${job.company_id.org_name}.`
        );
        console.log("Confirmation email sent");

        // await sendEmail(
        //     job.company_id.contact_email,
        //     "New Job Application - CampusHire",
        //     `${student.name} has applied for the job: ${job.job_title}. Check the CampusHire portal for details.`
        // );
        // console.log("Recruiter notified");

        res.status(200).json({ message: "Application submitted successfully." });
    } catch (error) {
        console.error("Apply job error:", error);  // <--- This should show the actual error
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