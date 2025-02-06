import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [profile, setProfile] = useState({
        phone: "",
        cgpa: "",
        resume_url: ""
    });
    const [editMode, setEditMode] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchJobs();
        fetchAppliedJobs();
        fetchStudentProfile();
    }, []);

    // Fetch all jobs
    const fetchJobs = async () => {
        try {
            const { data } = await axios.get("http://localhost:5001/api/jobs", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setJobs(data);
        } catch (error) {
            console.error("Error fetching jobs", error);
        }
    };

    // Fetch applied jobs with full details
    const fetchAppliedJobs = async () => {
        try {
            const { data: appliedJobIds } = await axios.get("http://localhost:5001/api/students/applied-jobs", {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Fetch matching job details for applied job IDs
            const matchedJobs = appliedJobIds.map((jobId) =>
                jobs.find((job) => job._id === jobId) || { _id: jobId, job_title: "Unknown Job", status: "Pending" }
            );

            setAppliedJobs(matchedJobs);
        } catch (error) {
            console.error("Error fetching applied jobs", error);
        }
    };

    // Fetch student profile details
    const fetchStudentProfile = async () => {
        try {
            const { data } = await axios.get("http://localhost:5001/api/students/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(data);
        } catch (error) {
            console.error("Error fetching student profile", error);
        }
    };

    // Apply for a job
    const handleApplyJob = async (jobId) => {
        try {
            await axios.post(`http://localhost:5001/api/jobs/${jobId}/apply`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Application submitted successfully!");
            fetchAppliedJobs();
        } catch (error) {
            alert("Failed to apply: " + (error.response?.data?.error || "Unknown error"));
        }
    };

    // Handle profile update
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await axios.put("http://localhost:5001/api/students/update-profile", profile, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Profile updated successfully!");
            setEditMode(false);
            fetchStudentProfile();
        } catch (error) {
            alert("Failed to update profile: " + (error.response?.data?.error || "Unknown error"));
        }
    };

    return (
        <div>
            <h2>🎓 Student Dashboard</h2>

            {/* Profile Section */}
            <h3>👤 Your Profile</h3>
            <button onClick={() => setEditMode(!editMode)}>
                {editMode ? "Cancel" : "Edit Profile"}
            </button>
            
            {editMode ? (
                <form onSubmit={handleUpdateProfile}>
                    <input
                        type="text"
                        placeholder="Phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="CGPA"
                        value={profile.cgpa}
                        onChange={(e) => setProfile({ ...profile, cgpa: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Resume URL"
                        value={profile.resume_url}
                        onChange={(e) => setProfile({ ...profile, resume_url: e.target.value })}
                        required
                    />
                    <button type="submit">Save Changes</button>
                </form>
            ) : (
                <div>
                    <p><strong>📞 Phone:</strong> {profile.phone}</p>
                    <p><strong>📊 CGPA:</strong> {profile.cgpa}</p>
                    <p><strong>📄 Resume:</strong> <a href={profile.resume_url} target="_blank" rel="noopener noreferrer">View Resume</a></p>
                </div>
            )}

            {/* Applied Jobs Section */}
            <h3>📌 Applied Jobs</h3>
            {appliedJobs.length === 0 ? (
                <p>You have not applied for any jobs yet.</p>
            ) : (
                <ul>
                    {appliedJobs.map((job) => (
                        <li key={job._id}>
                            <strong>{job.job_title}</strong> - <span>Status: {job.status || "Pending"}</span>
                        </li>
                    ))}
                </ul>
            )}

            {/* Available Jobs Section */}
            <h3>📌 Available Jobs</h3>
            <ul>
                {jobs.map((job) => (
                    <li key={job._id}>
                        <strong>{job.job_title}</strong> - {job.job_description}
                        <br />
                        <span>📅 Deadline: {job.application_deadline}</span>
                        <br />
                        <span>💰 Salary: {job.compensation.fixed_salary}</span>
                        <br />
                        {appliedJobs.some((appliedJob) => appliedJob._id === job._id) ? (
                            <button disabled>✅ Already Applied</button>
                        ) : (
                            <button onClick={() => handleApplyJob(job._id)}>Apply</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudentDashboard;
