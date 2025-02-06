const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    status: { type: String, enum: ["Pending", "Shortlisted", "Rejected", "Selected"], default: "Pending" },
    interview_schedule: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);
