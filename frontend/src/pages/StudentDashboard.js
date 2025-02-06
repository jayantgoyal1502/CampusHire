import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobs();
        fetchAppliedJobs();
    }, []);

    const fetchJobs = async () => {
        const token = localStorage.getItem("token");
        try {
            const { data } = await axios.get("http://localhost:5001/api/jobs", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setJobs(data);
        } catch (error) {
            console.error("Error fetching jobs", error);
        }
    };

    const fetchAppliedJobs = async () => {
        const token = localStorage.getItem("token");
        try {
            const { data } = await axios.get("http://localhost:5001/api/students/applied-jobs", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAppliedJobs(data);
        } catch (error) {
            console.error("Error fetching applied jobs", error);
        }
    };

    const handleApplyJob = async (jobId) => {
        const token = localStorage.getItem("token");
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

    return (
        <div>
            <h2>Student Dashboard</h2>

            <h3>Available Jobs</h3>
            <ul>
                {jobs.map((job) => (
                    <li key={job._id}>
                        <strong>{job.job_title}</strong> - {job.job_description}
                        <br />
                        <span>Deadline: {job.application_deadline}</span>
                        <br />
                        <span>Salary: {job.compensation.fixed_salary}</span>
                        <br />
                        {appliedJobs.includes(job._id) ? (
                            <button disabled>Already Applied</button>
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
