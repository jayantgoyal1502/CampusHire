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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 py-16">
            <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl border border-indigo-100">
                <h2 className="text-center text-3xl font-extrabold text-indigo-700 mb-6">Dashboard</h2>
                <h3 className="text-xl font-semibold text-indigo-600 mb-4">Available Jobs</h3>
                <ul className="space-y-4">
                    {jobs.map((job) => (
                        <li key={job._id} className="bg-indigo-50 p-4 rounded-lg shadow border border-indigo-100">
                            <strong className="text-indigo-800">{job.job_title}</strong> at <span className="text-indigo-600">{job.company_id.org_name}</span>
                            <br />
                            <button onClick={() => alert("Applied Successfully!")}
                                className="mt-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300 transition-all"
                            >Apply</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DashboardPage;
