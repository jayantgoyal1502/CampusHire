const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    feedback: { type: String, required: true },
    name: {
        type: String,
        default: "Anonymous",
    },
    email: {
        type: String,
        default: "Anonymous",
    },
    createdAt: { type: Date, default: Date.now },
});
feedbackSchema.index({ feedback: 1, email: 1 }, { unique: true });
module.exports = mongoose.model("Feedback", feedbackSchema);
