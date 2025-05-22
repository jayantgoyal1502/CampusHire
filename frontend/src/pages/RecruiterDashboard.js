import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import customApi from "../custom-api/axiosInstance";
import branchesList from "../shared/branchesList";
import FeedbackModal from "../components/FeedbackModal";
import ApplicantsList from '../components/ApplicantsList';

const RecruiterDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [applicantsByJob, setApplicantsByJob] = useState({});

    const [company, setCompany] = useState(null);
    const [orgName, setOrgName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [jobType, setJobType] = useState("");
    const [branchesEligible, setBranchesEligible] = useState([]);
    const [coursesEligible, setCoursesEligible] = useState([]);
    const [jobCategory, setJobCategory] = useState("");
    const [jobDeadline, setjobDeadline] = useState("");
    const [fixedSalary, setFixedSalary] = useState("");
    const [bonus, setBonus] = useState("");
    const [editingJobId, setEditingJobId] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (company?.org_name) {
            setOrgName(company.org_name);
        }
    }, [company]);

    useEffect(() => {
        fetchJobs();
        fetchCompanyDetails();
    }, []);

    useEffect(() => {
        // when jobs arrive, fetch applicants for each
        jobs.forEach((job) => {
            customApi.get(`/applications/${job._id}/applicants`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(({ data }) => {
                    setApplicantsByJob((prev) => ({ ...prev, [job._id]: data }));
                })
                .catch((err) => console.error("Error fetching applicants", err));
        });
    }, [jobs]);

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
            job_type: jobType,
            job_deadline: jobDeadline,
            compensation: {
                fixed_salary: fixedSalary,
                variable_component: bonus || 0,
            },
            branches_eligible: branchesEligible,
            courses_eligible: coursesEligible,
            job_category:jobCategory,
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

            alert("Job posted successfully!");
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
    const handleCourseChange = (e) => {
        const selectedCourse = e.target.value;
        setCoursesEligible((prevCourses) => {
            if (prevCourses.includes(selectedCourse)) {
                return prevCourses.filter((course) => course !== selectedCourse);
            } else {
                return [...prevCourses, selectedCourse];
            }
        });
    };

    const handleEditJob = (job) => {
        setEditingJobId(job._id);
        setOrgName(job.org_name);
        setJobTitle(job.job_title);
        setJobDescription(job.job_description);
        setjobDeadline(job.job_deadline);
        setFixedSalary(job.compensation?.fixed_salary || "");
        setBonus(job.compensation?.variable_component || "");
        setBranchesEligible(job.branches_eligible);
        setCoursesEligible(job.couses_eligible);
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
        setJobType("");
        setjobDeadline("");
        setFixedSalary("");
        setBonus("");
        setBranchesEligible([]);
        setCoursesEligible([]);
    };

    return (
        <div className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-2xl border border-indigo-100">
            {/* Header Section */}
            <h2 className="text-4xl font-extrabold text-center mb-10 text-indigo-700 tracking-tight drop-shadow-sm">Recruiter Dashboard</h2>

            {/* Company Profile Section */}
            <div className="flex items-center space-x-4 mb-10 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl shadow">
                <div className="w-16 h-16 bg-indigo-200 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-700 border-2 border-indigo-400">
                    {company?.org_name ? company.org_name.charAt(0).toUpperCase() : "?"}
                </div>
                <div>
                    <h2 className="text-2xl font-semibold text-indigo-800">{company?.org_name.toUpperCase() || "Company Name"}</h2>
                    <p className="text-gray-500">{company?.contact_email || "No email provided"}</p>
                </div>
            </div>

            {/* Job Posting Form */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-indigo-100">
                <h3 className="text-2xl font-bold mb-6 text-indigo-700">{editingJobId ? "Edit Job" : "Post a New Job"}</h3>
                <form onSubmit={handleCreateOrUpdateJob} className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    <div>
                        <label className="block text-sm font-medium">Organisation Name</label>
                        <input
                            type="text"
                            placeholder="Enter Organisation Name"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            className="w-full p-2 mt-1 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-indigo-50 text-indigo-900 placeholder:text-indigo-400"
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
                            className="w-full p-2 mt-1 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-indigo-50 text-indigo-900 placeholder:text-indigo-400"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium">Job Description</label>
                        <textarea
                            placeholder="Enter Job Description"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="w-full p-2 mt-1 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-indigo-50 text-indigo-900 placeholder:text-indigo-400 min-h-[80px]"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block mb-2 font-medium">Job Type</label>
                        <select
                            value={jobType}
                            onChange={(e) => setJobType(e.target.value)}
                            className="border p-2 rounded-lg w-full border-indigo-200 bg-indigo-50 text-indigo-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            required
                        >
                            <option value="">Select Job Type</option>
                            <option value="Internship">Internship</option>
                            <option value="PPO">PPO</option>
                            <option value="Full-Time">Full-Time</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium">Eligible Branches</label>
                        <div className="w-full p-2 mt-1 border border-indigo-200 rounded-lg bg-indigo-50">
                            {branchesList.map((branch) => (
                                <label key={branch} className="flex items-center space-x-2 py-1">
                                    <input
                                        type="checkbox"
                                        value={branch}
                                        checked={branchesEligible.includes(branch)}
                                        onChange={handleBranchChange}
                                        className="w-4 h-4 text-indigo-600 border-indigo-300 rounded focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-indigo-800">{branch}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium">Eligible Courses</label>
                        <div className="w-full p-2 mt-1 border border-indigo-200 rounded-lg bg-indigo-50">
                            {['B.Tech', 'M.Tech', 'MCA'].map((course) => (
                                <label key={course} className="flex items-center space-x-2 py-1">
                                    <input
                                        type="checkbox"
                                        value={course}
                                        checked={coursesEligible.includes(course)}
                                        onChange={handleCourseChange}
                                        className="w-4 h-4 text-indigo-600 border-indigo-300 rounded focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-indigo-800">{course}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block mb-2 font-medium">Job Category</label>
                        <select
                            value={jobCategory}
                            onChange={(e) => setJobCategory(e.target.value)}
                            className="border p-2 rounded-lg w-full border-indigo-200 bg-indigo-50 text-indigo-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            required
                        >
                            <option value="">Select Job Category</option>
                            <option value="Software">Software</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Finance">Finance</option>
                            <option value="Design">Design</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Application Deadline</label>
                        <input
                            type="date"
                            value={jobDeadline}
                            onChange={(e) => setjobDeadline(e.target.value)}
                            className="w-full p-2 mt-1 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-indigo-50 text-indigo-900"
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
                            className="w-full p-2 mt-1 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-indigo-50 text-indigo-900 placeholder:text-indigo-400"
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
                            className="w-full p-2 mt-1 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-indigo-50 text-indigo-900 placeholder:text-indigo-400"
                            required
                        />
                    </div>

                    {/* Buttons */}
                    <div className="md:col-span-2 flex space-x-4 mt-4">
                        <button type="submit" className="px-8 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300 transition-all">
                            {editingJobId ? "Update Job" : "Post Job"}
                        </button>
                        {editingJobId && (
                            <button type="button" onClick={resetForm} className="px-8 py-2 bg-gray-300 text-indigo-700 font-semibold rounded-lg shadow hover:bg-gray-400 focus:ring-2 focus:ring-indigo-200 transition-all">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
            {/* Job Listings */}
            <h3 className="text-2xl font-bold mt-12 mb-6 text-indigo-700">Your Job Listings</h3>
            {jobs.length === 0 ? (
                <p className="text-gray-500 text-center">No jobs posted yet.</p>
            ) : (
                <ul className="space-y-8">
                    {jobs.map((job) => (
                        <li key={job._id} className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl shadow-md border border-indigo-100">
                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <h4 className="text-xl font-bold text-indigo-800">{job.job_title}</h4>
                                    <p className="text-sm text-indigo-600 mb-1">{job.job_description}</p>
                                    <p className="text-xs text-gray-500">Posted by: {job.company_id?.org_name || "Unknown Company"}</p>
                                    <p className={job.job_status === "Expired" ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>
                                        {job.job_status}
                                    </p>
                                </div>
                                <div>
                                    {job.job_status !== "Expired" && (
                                        <button
                                            onClick={() => handleEditJob(job)}
                                            className="bg-blue-500 text-white py-1 px-4 rounded-lg hover:bg-blue-600 shadow focus:ring-2 focus:ring-blue-200"
                                        >
                                            Edit
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteJob(job._id)}
                                        className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600 shadow ml-2 focus:ring-2 focus:ring-red-200"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-indigo-700 mt-2">
                                <p className="col-span-1">📅 <span className="font-semibold">Deadline:</span> {job.job_deadline}</p>
                                <p className="col-span-1">💰 <span className="font-semibold">Fixed Salary:</span> {job.compensation?.fixed_salary}</p>
                                <p className="col-span-1">🎁 <span className="font-semibold">Bonus:</span> {job.compensation?.variable_component}</p>
                                <p className="col-span-1">🧾 <span className="font-semibold">Job Type:</span> {job.job_type}</p>
                            </div>

                            <h4 className="mt-4 font-semibold text-indigo-800">Applicants</h4>
                            <ApplicantsList
                                applicants={applicantsByJob[job._id]}
                                jobId={job._id}
                                handleApplicationStatus={handleApplicationStatus}
                            />
                        </li>
                    ))}
                </ul>
            )}
            <FeedbackModal />
        </div>
    );
};

export default RecruiterDashboard;
