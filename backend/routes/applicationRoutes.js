const express = require("express");
const Application = require("../models/Application");

const router = express.Router();

// Route: Apply for a job
router.post("/apply", async (req, res) => {
    try {
        const application = new Application(req.body);
        await application.save();
        res.status(201).json(application);
    } catch (error) {
        res.status(400).json({ error: error.message });
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
