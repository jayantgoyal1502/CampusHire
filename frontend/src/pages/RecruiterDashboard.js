import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import customApi from "../custom-api/axiosInstance";

const RecruiterDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [company, setCompany] = useState(null);
    const [orgName, setOrgName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [branchesEligible, setBranchesEligible] = useState([]);
    const [jobDeadline, setjobDeadline] = useState("");
    const [fixedSalary, setFixedSalary] = useState("");
    const [bonus, setBonus] = useState("");
    const [editingJobId, setEditingJobId] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const branchesList = ["CSE", "IT", "ECE", "EE", "IPE", "TT", "Civil", "ME", "BT"];

    useEffect(() => {
        if (company?.org_name) {
            setOrgName(company.org_name);
        }
    }, [company]);

    useEffect(() => {
        fetchJobs();
        fetchCompanyDetails();
    }, []);

    const fetchJobs = async () => {
        try {
            const { data } = await customApi.get("/jobs/recruiter", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setJobs(data);
        } catch (error) {
            console.error("Error fetching jobs", error);
        }
    };

    const fetchCompanyDetails = async () => {
        try {
            const { data } = await customApi.get("/recruiters/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCompany(data);
        } catch (error) {
            console.error("Error fetching company details", error);
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
            org_name: orgName,
            job_description: jobDescription,
            job_deadline: jobDeadline,
            compensation: {
                fixed_salary: fixedSalary,
                variable_component: bonus || 0, // Default to 0 if empty
            },
            branches_eligible: branchesEligible,
        };

        try {
            if (editingJobId) {
                await customApi.put(`/jobs/${editingJobId}`, requestData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await customApi.post("/jobs/create", requestData, {
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
            await customApi.delete(`/jobs/${jobId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchJobs();
        } catch (error) {
            console.error("Error deleting job", error);
        }
    };

    const handleBranchChange = (event) => {
        const { value, checked } = event.target;

        setBranchesEligible((prevBranches) =>
            checked ? [...prevBranches, value] : prevBranches.filter((branch) => branch !== value)
        );
    };

    const handleEditJob = (job) => {
        setEditingJobId(job._id);
        setOrgName(job.org_name);
        setJobTitle(job.job_title);
        setJobDescription(job.job_description);
        setjobDeadline(job.job_deadline);
        setFixedSalary(job.compensation?.fixed_salary || "");
        setBonus(job.compensation?.bonus || "");
        setBranchesEligible(job.branches_eligible);
    };

    const handleApplicationStatus = async (student_id, job_id, status) => {
        try {
            const url = `/applications/update/status`;
            await customApi.put(
                url,
                { student_id, job_id, approval_status: status },
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
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
        setjobDeadline("");
        setFixedSalary("");
        setBonus("");
        setBranchesEligible([]);
    };

    return (
        <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg">
            {/* Header Section */}
            <h2 className="text-3xl font-bold text-center mb-8">Recruiter Dashboard</h2>

            {/* Company Profile Section */}
            <div className="flex items-center space-x-4 mb-8 bg-gray-100 p-4 rounded-lg">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-gray-700">
                    {company?.org_name ? company.org_name.charAt(0).toUpperCase() : "?"}
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">{company?.org_name.toUpperCase() || "Company Name"}</h2>
                    <p className="text-gray-600">{company?.contact_email || "No email provided"}</p>
                </div>
            </div>

            {/* Job Posting Form */}
            <div className="bg-gray-50 p-6 rounded-lg shadow">
                <h3 className="text-2xl font-semibold mb-4">{editingJobId ? "Edit Job" : "Post a New Job"}</h3>
                <form onSubmit={handleCreateOrUpdateJob} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <label className="block text-sm font-medium">Organisation Name</label>
                        <input
                            type="text"
                            placeholder="Enter Organisation Name"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Job Title</label>
                        <input
                            type="text"
                            placeholder="Enter Job Title"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium">Job Description</label>
                        <textarea
                            placeholder="Enter Job Description"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium">Eligible Branches</label>
                        <div className="w-full p-2 mt-1 border border-gray-300 rounded-md">
                            {branchesList.map((branch) => (
                                <label key={branch} className="flex items-center space-x-2 py-1">
                                    <input
                                        type="checkbox"
                                        value={branch}
                                        checked={branchesEligible.includes(branch)}
                                        onChange={handleBranchChange}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm">{branch}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Application Deadline</label>
                        <input
                            type="date"
                            value={jobDeadline}
                            onChange={(e) => setjobDeadline(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Fixed Salary</label>
                        <input
                            type="number"
                            placeholder="Enter Fixed Salary"
                            value={fixedSalary}
                            onChange={(e) => setFixedSalary(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium">Variable Salary</label>
                        <input
                            type="number"
                            placeholder="Enter Variable Salary"
                            value={bonus}
                            onChange={(e) => setBonus(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    {/* Buttons */}
                    <div className="md:col-span-2 flex space-x-4">
                        <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">
                            {editingJobId ? "Update Job" : "Post Job"}
                        </button>
                        {editingJobId && (
                            <button type="button" onClick={resetForm} className="px-6 py-2 bg-gray-400 text-white font-semibold rounded-md hover:bg-gray-500">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Job Listings */}
            <h3 className="text-2xl font-semibold mt-8 mb-4">Your Job Listings</h3>
            {jobs.length === 0 ? (
                <p className="text-gray-600 text-center">No jobs posted yet.</p>
            ) : (
                <ul className="space-y-6">
                    {jobs.map((job) => (
                        <li key={job._id} className="bg-gray-50 p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <h4 className="text-xl font-semibold">{job.job_title}</h4>
                                    <p className="text-sm text-gray-500">{job.job_description}</p>
                                    <p className="text-sm text-gray-500">Posted by: {job.company_id?.org_name || "Unknown Company"}</p>
                                    <p className={job.job_status === "Expired" ? "text-red-500" : "text-green-600"}>
                                        {job.job_status}
                                    </p>
                                </div>
                                <div>
                                    {job.job_status !== "Expired" && (
                                        <button
                                            onClick={() => handleEditJob(job)}
                                            className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteJob(job._id)}
                                        className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600 ml-2"
                                    >
                                        Delete
                                    </button>
                                </div>

                            </div>
                            <p className="text-sm text-gray-600">📅 Deadline: {job.job_deadline}</p>
                            <p className="text-sm text-gray-600">💰 Fixed Salary: {job.compensation?.fixed_salary}</p>
                            <p className="text-sm text-gray-600">🎁 Bonus: {job.compensation?.variable_component}</p>

                            {/* Applicants List */}
                            <h4 className="mt-4 font-semibold">Applicants</h4>
                            {job.applicants?.length > 0 ? (
                                <ul>
                                    {job.applicants.map((applicant) => (
                                        <li key={applicant._id} className="flex justify-between items-center py-2 border-b">
                                            <p>{applicant.name} - {applicant.email}</p>
                                            <div>
                                                <button onClick={() => handleApplicationStatus(applicant._id, job._id, "Selected")} className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600">
                                                    Accept
                                                </button>
                                                <button onClick={() => handleApplicationStatus(applicant._id, job._id, "Rejected")} className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 ml-2">
                                                    Reject
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-600">No applicants yet.</p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RecruiterDashboard;
