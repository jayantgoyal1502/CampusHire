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
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
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

        try {
            if (editingJobId) {
                await axios.put(`http://localhost:5001/api/jobs/${editingJobId}`, requestData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post("http://localhost:5001/api/jobs/create", requestData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            resetForm();
            fetchJobs();
        } catch (error) {
            alert("Failed to create/update job: " + (error.response?.data?.error || "Unknown error"));
        }
    };

    const handleDeleteJob = async (jobId) => {
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

    const handleApplicationStatus = async (jobId, studentId, status) => {
        try {
            await axios.put(
                `http://localhost:5001/api/jobs/${jobId}/applications/${studentId}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`Application ${status} successfully`);
            fetchJobs();
        } catch (error) {
            alert("Failed to update application status");
        }
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
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-center mb-6">Recruiter Dashboard</h2>

            <div className="bg-gray-100 p-4 rounded-lg mb-8">
                <h3 className="text-2xl font-semibold mb-4">{editingJobId ? "Edit Job" : "Post a New Job"}</h3>
                <form onSubmit={handleCreateOrUpdateJob} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Job Title</label>
                        <input
                            type="text"
                            placeholder="Job Title"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Job Description</label>
                        <textarea
                            placeholder="Job Description"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Application Deadline</label>
                        <input
                            type="date"
                            value={applicationDeadline}
                            onChange={(e) => setApplicationDeadline(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Fixed Salary</label>
                        <input
                            type="number"
                            placeholder="Fixed Salary"
                            value={fixedSalary}
                            onChange={(e) => setFixedSalary(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Bonus (Optional)</label>
                        <input
                            type="number"
                            placeholder="Bonus"
                            value={bonus}
                            onChange={(e) => setBonus(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none"
                        >
                            {editingJobId ? "Update Job" : "Post Job"}
                        </button>
                        {editingJobId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-2 bg-gray-400 text-white font-semibold rounded-md hover:bg-gray-500 focus:outline-none"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <h3 className="text-2xl font-semibold mb-4">Your Job Listings</h3>
            {jobs.length === 0 ? (
                <p>No jobs posted yet.</p>
            ) : (
                <ul className="space-y-6">
                    {jobs.map((job) => (
                        <li key={job._id} className="bg-gray-50 p-4 rounded-lg shadow-md">
                            <div className="flex justify-between items-center">
                                <div>
                                    <strong className="text-xl font-semibold">{job.job_title}</strong>
                                    <p className="text-sm text-gray-500">{job.job_description}</p>
                                    <p className="text-sm text-gray-500">Posted by: {job.company_id?.org_name || "Unknown Company"}</p>
                                </div>
                                <div>
                                    <button
                                        onClick={() => handleEditJob(job)}
                                        className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteJob(job._id)}
                                        className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600 ml-2"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <p className="mt-2 text-sm text-gray-600">📅 Deadline: {job.application_deadline}</p>
                            <p className="mt-2 text-sm text-gray-600">💰 Fixed Salary: {job.compensation?.fixed_salary}</p>
                            <p className="mt-2 text-sm text-gray-600">🎁 Bonus: {job.compensation?.bonus}</p>

                            <h4 className="mt-4 font-semibold">Applicants</h4>
                            {job.applicants?.length > 0 ? (
                                <ul>
                                    {job.applicants.map((applicant) => (
                                        <li key={applicant._id} className="flex justify-between items-center py-2">
                                            <div>
                                                <p>{applicant.name} - {applicant.email}</p>
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() => handleApplicationStatus(job._id, applicant._id, "Accepted")}
                                                    className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleApplicationStatus(job._id, applicant._id, "Rejected")}
                                                    className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 ml-2"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No applicants yet.</p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RecruiterDashboard;
