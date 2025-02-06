import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RecruiterDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [applicationDeadline, setApplicationDeadline] = useState("");
    const [fixedSalary, setFixedSalary] = useState("");
    const [bonus, setBonus] = useState("");
    const [editingJobId, setEditingJobId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        const token = localStorage.getItem("token");
        try {
            const { data } = await axios.get("http://localhost:5001/api/jobs/recruiter", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setJobs(data);
        } catch (error) {
            console.error("Error fetching jobs", error);
        }
    };

    const handleCreateOrUpdateJob = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            alert("No token found. Please log in again.");
            navigate("/login/recruiter");
            return;
        }

        const requestData = {
            job_title: jobTitle,
            job_description: jobDescription,
            application_deadline: applicationDeadline,
            compensation: {
                fixed_salary: fixedSalary,
                bonus: bonus || 0, // Default to 0 if empty
            },
        };

        console.log("Sending Job Data:", requestData);

        try {
            if (editingJobId) {
                await axios.put(
                    `http://localhost:5001/api/jobs/${editingJobId}`,
                    requestData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                await axios.post(
                    "http://localhost:5001/api/jobs/create",
                    requestData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            resetForm();
            fetchJobs();
        } catch (error) {
            console.error("Error creating/updating job:", error.response?.data || error.message);
            alert("Failed to create/update job: " + (error.response?.data?.error || "Unknown error"));
        }
    };

    const handleDeleteJob = async (jobId) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`http://localhost:5001/api/jobs/${jobId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchJobs();
        } catch (error) {
            console.error("Error deleting job", error);
        }
    };

    const handleEditJob = (job) => {
        setEditingJobId(job._id);
        setJobTitle(job.job_title);
        setJobDescription(job.job_description);
        setApplicationDeadline(job.application_deadline);
        setFixedSalary(job.compensation?.fixed_salary || "");
        setBonus(job.compensation?.bonus || "");
    };

    const resetForm = () => {
        setEditingJobId(null);
        setJobTitle("");
        setJobDescription("");
        setApplicationDeadline("");
        setFixedSalary("");
        setBonus("");
    };

    return (
        <div>
            <h2>Recruiter Dashboard</h2>

            <form onSubmit={handleCreateOrUpdateJob}>
                <input
                    type="text"
                    placeholder="Job Title"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Job Description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    required
                />
                <label>Application Deadline:</label>
                <input
                    type="date"
                    value={applicationDeadline}
                    onChange={(e) => setApplicationDeadline(e.target.value)}
                    required
                />
                <label>Fixed Salary:</label>
                <input
                    type="number"
                    placeholder="Fixed Salary"
                    value={fixedSalary}
                    onChange={(e) => setFixedSalary(e.target.value)}
                    required
                />
                <label>Bonus (Optional):</label>
                <input
                    type="number"
                    placeholder="Bonus"
                    value={bonus}
                    onChange={(e) => setBonus(e.target.value)}
                />
                <button type="submit">{editingJobId ? "Update Job" : "Post Job"}</button>
                {editingJobId && <button type="button" onClick={resetForm}>Cancel</button>}
            </form>

            <h3>Your Job Listings</h3>
            <ul>
                {jobs.map((job) => (
                    <li key={job._id}>
                        <strong>{job.job_title}</strong> - {job.job_description}
                        <br />
                        <span>Deadline: {job.application_deadline}</span>
                        <br />
                        <span>Fixed Salary: {job.compensation?.fixed_salary}</span>
                        <br />
                        <span>Bonus: {job.compensation?.bonus}</span>
                        <br />
                        <button onClick={() => handleEditJob(job)}>Edit</button>
                        <button onClick={() => handleDeleteJob(job._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecruiterDashboard;
