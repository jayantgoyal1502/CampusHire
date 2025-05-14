require("dotenv").config({ path: "./backend/.env" }); // Explicitly define the path
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

const fs = require("fs");
const path = require("path");

const uploadsDir = path.join(__dirname, "uploads");
const resumesDir = path.join(uploadsDir, "resumes");

// Ensure uploads and resumes folders exist
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

if (!fs.existsSync(resumesDir)) {
    fs.mkdirSync(resumesDir);
}

// Serve static resumes files
app.use("/uploads/resumes", express.static(path.join(__dirname, "uploads/resumes")));

// Import Routes
const recruiterRoutes = require("./routes/recruiterRoutes");
const jobRoutes = require("./routes/jobRoutes");
const studentRoutes = require("./routes/studentRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const adminRoutes = require("./routes/adminRoutes");
// Use Routes
app.use("/api/recruiters", recruiterRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/feedback", require("./routes/feedback"));

app.get("/", (req, res) => {
    res.send("CampusHire API is running...");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
