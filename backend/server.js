require("dotenv").config({ path: "./backend/.env" }); // Explicitly define the path
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const multer = require("multer");
const path = require("path");

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "backend/t-uploads/"); // Ensure this folder exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

// Serve uploaded files statically
app.use("/t-uploads", express.static(path.join(__dirname, "t-uploads")));

// Resume Upload API
app.post("/api/students/upload-resume", upload.single("resume"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    const fileUrl = `${process.env.BACKEND_URL || "http://localhost:5001"}/t-uploads/${req.file.filename}`;
    res.status(201).json({ fileUrl });
});

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

app.get("/", (req, res) => {
    res.send("CampusHire API is running...");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
