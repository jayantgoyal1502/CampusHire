const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true, // Ensures all emails are stored in lowercase
            trim: true
        },
        password: {         //strong password policy
            type: String,
            required: true,
            minlength: 8,
            match: [
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
            ]
          },
        role: {
            type: String,
            enum: ["SuperAdmin", "Admin"],
            default: "Admin"
        }
    },
    { timestamps: true }
);

// Hash password before saving
adminSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare entered password with hashed password
adminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);
