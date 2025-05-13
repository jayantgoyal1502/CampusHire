const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const recruiterSchema = new mongoose.Schema(
    {
        org_name: { type: String, required: true },
        website: {
            type: String,
            validate: {
                validator: function (v) {
                    return !v || /^(ftp|http|https):\/\/[^ "]+$/.test(v);
                },
                message: "Invalid website URL"
            },
            required: true,
        },
        category: {
            type: String,
            enum: ["Govt", "PSU", "Private", "MNC", "Startup", "NGO", "Other"],
            required: true
        },
        sector: { type: String},
        participation_type: {
            type: String,
            enum: ["Virtual", "On-Campus"],
            required: true
        },
        contact_name: { type: String, required: true },
        contact_designation: { type: String, required: true },
        contact_email: { type: String, required: true, unique: true },
        contact_phone: {
            type: String,
            required: true,
            match: [/^\d{10}$/, "Invalid phone number"]
        },
        address: { type: String },
        password: {
            type: String,
            required: true,
            minlength: 8,
            match: [
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
            ]
        },
        linkedin_profile: { type: String },
        company_type: { type: String, enum: ["Product-Based", "Service-Based", "Consulting"] },
    },
    { timestamps: true }
);

// Hash password before saving
recruiterSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare entered password with hashed password
recruiterSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Recruiter", recruiterSchema);
