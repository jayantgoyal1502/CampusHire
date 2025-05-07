const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: {
        type: String,
        required: true,
        match: [/^\d{10}$/, "Invalid phone number"]
    },
    dob: { type: Date }, // Date of birth
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    address: { type: String },
    rollnum: { type: Number, required: true, unique: true },
    course: {
        type: String,
        enum: ["B.Tech", "M.Tech", "PhD"],
        require: true,
    },
    graduation_year: {
        type: Number,
    },
    branch: { type: String, required: true },
    cgpa: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    languages_known: [{ type: String }],
    certifications: [{
        name: { type: String, required: true },
        issuing_org: { type: String },
        issue_date: { type: Date }
    }],
    skills: [{ type: String }], // Array of skills
    linkedin_url: {
        type: String,
        validate: {
            validator: function (v) {
                return /^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(v);
            },
            message: "Invalid LinkedIn URL"
        }
    },
    github_url: {
        type: String,
        validate: {
            validator: function (v) {
                return /^https?:\/\/(www\.)?github\.com\/.*$/.test(v);
            },
            message: "Invalid GitHub URL"
        }
    },
    preferred_location: [{ type: String }],
    projects: [{
        title: { type: String, required: true },
        description: { type: String }
    }],
    resume_url: {
        type: String,
        validate: {
            validator: function (v) {
                return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
            },
            message: "Invalid resume URL"
        }
    },
    // resumes: [
    //     {
    //         category: {
    //             type: String,
    //             enum: ["Software", "Engineering", "Finance", "Other"],
    //             required: true
    //         },
    //         resume_url: {
    //             type: String,
    //             validate: {
    //                 validator: function(v) {
    //                     return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
    //                 },
    //                 message: "Invalid resume URL"
    //             },
    //             required: true
    //         }
    //     }
    // ],
    placement_type: {
        type: String,
        enum: ["Internship", "Placement"],
    },
    placement_status: {
        type: String,
        enum: ["Unplaced", "Single Offer", "Double Offer"],
        default: "Unplaced"
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
        ]
    },
    applied_jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job", default: [] }]

}, { timestamps: true });

studentSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

studentSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Student", studentSchema);
