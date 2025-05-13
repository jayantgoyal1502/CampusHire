const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const { protect } = require("../middleware/authMiddleware");
const sendEmail = require("../utils/sendEmail");

router.post("/", protect, async (req, res) => {
    if (!req.body.feedback || req.body.feedback.trim() === "") {
        return res.status(400).json({ error: "Feedback cannot be empty" });
    }
    try {
        const newFeedback = new Feedback({
            feedback: req.body.feedback,
            name: req.user?.name || req.user?.org_name || "Anonymous",
            email: req.user?.email || req.user?.contact_email || "Anonymous",
        });
        await newFeedback.save();
        await sendEmail(
            req.user?.email,
            "Thank You for Your Feedback - CampusHire",
            "Thank you for submitting your valuable feedback. We appreciate your effort to help us improve."
        );
        // Check if total feedbacks have exceeded the threshold
        const feedbackCount = await Feedback.countDocuments();
        if (feedbackCount > 20) {
            await sendEmail(
                process.env.DEVELOPER_EMAIL,
                "Feedback Alert - CampusHire",
                `Attention: The total number of feedback submissions has exceeded 20. Immediate review is needed.`
            );
        }
        res.status(201).json({ message: "Feedback submitted successfully" });

    } catch (error) {
        console.error("Error submitting feedback:", error);
        res.status(500).json({ error: "Server error while submitting feedback, please try again later." });
    }
});

module.exports = router;
