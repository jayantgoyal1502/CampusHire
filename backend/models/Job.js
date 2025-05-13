const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        company_id: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Recruiter", 
            required: true 
        },
        org_name: { 
            type: String, 
            required: true,
            set: (name) => name.trim().replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize words
        },
        job_title: { 
            type: String, 
            required: true,
            set: (title) => title.trim().replace(/\b\w/g, (char) => char.toUpperCase()) 
        },
        job_description: { type: String, required: true },
        skills_required: { type: [String]},
        branches_eligible: { type: [String], required: true },
        batch_eligible: { type: [String] },
        compensation: {
            fixed_salary: { 
                type: Number, 
                required: true, 
                min: [0, "Salary cannot be negative"] 
            },
            variable_component: { 
                type: Number, 
                required: true, 
                min: [0, "Variable component cannot be negative"]
            }
        },
        bond_required: { type: Boolean, default: false },
        job_type: { type: String, enum: ["Full-Time","Internship", "PPO"]},
        selection_process: [{ type: String }],
        job_location: {
            india: { type: Boolean, default: true },
            abroad: { type: Boolean, default: false },
            specific_location: { type: String, default: "Not Specified" }
        },
        job_deadline: { 
            type: Date, 
            required: true,
            validate: {
                validator: function (value) {
                    return value > new Date(); // Ensures deadline is in the future
                },
                message: "Job deadline must be in the future"
            }
        },
        applicants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student",
            }
        ],
        job_status: { 
            type: String, 
            enum: ["Active", "Expired"], 
            default: "Active" 
        }
    }, 

    { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
