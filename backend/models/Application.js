const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    student_rollnum: String,
    student_name: String,
    student_email: String,
    student_course: String,
    student_branch: String,
    student_cgpa: String,
    selected_resume: {
        resume_url: String,
        category: String,
    },
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    job_title: String,
    org_name: String,
    approval_status: {
        type: String,
        enum: ["Pending", "Rejected", "Selected"],
        default: "Pending"
    },
    appliedAt: { type: Date, default: Date.now },
    interview_schedule: {
        type: Date,
        validate: {
            validator: function (value) {
                return !value || value > new Date();
            },
            message: "Interview schedule must be in the future"
        }
    }
}, { timestamps: true });

// Prevent duplicate applications
applicationSchema.index({ student_id: 1, job_id: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
