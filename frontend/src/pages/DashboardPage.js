import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DashboardPage = () => {
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

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

        fetchJobs();
    }, [navigate]);

    return (
        <div>
            <h2>Dashboard</h2>
            <h3>Available Jobs</h3>
            <ul>
                {jobs.map((job) => (
                    <li key={job._id}>
                        <strong>{job.job_title}</strong> at {job.company_id.org_name}
                        <br />
                        <button onClick={() => alert("Applied Successfully!")}>Apply</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DashboardPage;
