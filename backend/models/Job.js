const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter", required: true },
    job_title: { type: String, required: true },
    job_description: { type: String, required: true },
    skills_required: [{ type: String }],
    branches_eligible: [{ type: String }],
    compensation: {
        fixed_salary: { type: Number, required: true },
        variable_component: { type: Number, default: 0 }
    },
    bond_required: { type: Boolean, default: false },
    selection_process: [{ type: String }],
    job_location: {
        india: { type: Boolean, default: true },
        abroad: { type: Boolean, default: false },
        specific_location: { type: String }
    },
    summer_internship: { type: Boolean, default: false },
    application_deadline: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
