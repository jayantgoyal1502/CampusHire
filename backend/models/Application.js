const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    approval_status: { type: String, enum: ["Pending", "Ongoing", "Rejected", "Selected"], default: "Pending" },
    interview_schedule: { 
        type: Date,
        validate: {
            validator: function (value) {
                return !value || value > new Date(); // Ensure interview date is in the future
            },
            message: "Interview schedule must be in the future",
        },
    }
}, { timestamps: true });

// Prevent duplicate applications for the same job by the same student
applicationSchema.index({ student_id: 1, job_id: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
