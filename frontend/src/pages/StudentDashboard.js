import React, { useEffect, useState } from "react";
import customApi from "../custom-api/axiosInstance";
import FeedbackModal from "../components/FeedbackModal";

const StudentDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [profile, setProfile] = useState({
        phone: "",
        cgpa: "",
    });
    const [editMode, setEditMode] = useState(false);
    const token = localStorage.getItem("token");
    const [loadingJobId, setLoadingJobId] = useState(null);

    const [resumes, setResumes] = useState([]); // New resumes array
    const [newResumeFiles, setNewResumeFiles] = useState([]); // For newly selected files
    const [newResumeMeta, setNewResumeMeta] = useState([]); // Metadata (category) for new resumes
    const [selectedResumes, setSelectedResumes] = useState({});


    useEffect(() => {
        fetchJobs();
        fetchAppliedJobs();
        fetchStudentProfile();
    }, []);

    const [filters, setFilters] = useState({
        job_type: '',
        job_category: '',
        category: '',
        participation_type: '',
    });

    const fetchJobs = async () => {
        try {
            const params = new URLSearchParams();

            if (filters.job_type) params.append('job_type', filters.job_type);
            if (filters.job_category) params.append('job_category', filters.job_category);

            if (filters.category) params.append('category', filters.category);
            if (filters.participation_type) params.append('participation_type', filters.participation_type);

            const { data } = await customApi.get(`/jobs?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setJobs(data);
        } catch (error) {
            console.error("Error fetching jobs", error);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        fetchJobs();
    }, [filters]);

    const fetchAppliedJobs = async () => {
        try {
            const { data: appliedJobs } = await customApi.get("/students/applied-jobs", {
                headers: { Authorization: `Bearer ${token}` },
            });
            // console.log("Fetched applied jobs:", appliedJobs);
            setAppliedJobs(appliedJobs);
            return appliedJobs;
        } catch (error) {
            console.error("Error fetching applied jobs", error);
        }
    };

    const fetchStudentProfile = async () => {
        try {
            const { data } = await customApi.get("/students/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setResumes(data.resumes || []);
            setProfile(data);
        } catch (error) {
            console.error("Error fetching student profile", error);
        }
    };

    const handleApplyJob = async (jobId) => {
        const resumeIndex = selectedResumes[jobId];
        if (resumeIndex === undefined) {
            alert("Please select a resume before applying.");
            return;
        }
        setLoadingJobId(jobId);
        try {
            await customApi.post(
                `/applications/${jobId}/apply`,
                { resumeIndex },  // Send resumeIndex in the request body
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert("Application submitted successfully!");
            const updatedAppliedJobs = await fetchAppliedJobs();
            setAppliedJobs(updatedAppliedJobs);
        } catch (error) {
            alert("Failed to apply: " + (error.response?.data?.error || "Unknown error"));
        } finally {
            setLoadingJobId(null);  //stop loading
        }
    };

    const CategoryEnum = ["Software", "Engineering", "Finance", "Other"];  // Enum values for category

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        // Ensure that all new resumes have categories
        const missingCategories = newResumeMeta.filter((meta) => !meta.category);
        if (missingCategories.length > 0) {
            return alert("Please select a category for all resumes.");
        }

        // Ensure that all categories are valid (i.e., they match the allowed categories in CategoryEnum)
        const invalidCategories = newResumeMeta.filter((meta) => !CategoryEnum.includes(meta.category));
        if (invalidCategories.length > 0) {
            return alert("Some categories are invalid. Please select a valid category.");
        }

        try {
            const formData = new FormData();
            formData.append("phone", profile.phone);
            formData.append("cgpa", profile.cgpa);

            // Create an array to hold all metadata for the resumes
            const resumesMeta = newResumeFiles.map((file, index) => ({
                filename: file.name,  // Assuming you're using the file's name for the filename
                category: newResumeMeta[index].category,
            }));

            formData.append("resumesMeta", JSON.stringify(resumesMeta));

            // Append the resume files
            newResumeFiles.forEach((file) => {
                formData.append("resumes", file); // Appending all files under the same key "resumes"
            });

            await customApi.put("/students/update-profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Profile updated successfully!");
            setEditMode(false);
            setNewResumeFiles([]);
            setNewResumeMeta([]);
            fetchStudentProfile();
        } catch (error) {
            alert("Failed to update profile: " + (error.response?.data?.error || "Unknown error"));
        }
    };


    const handleResumeChange = (jobId, resumeIndex) => {
        setSelectedResumes(prev => ({ ...prev, [jobId]: resumeIndex }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-10">
            <div className="max-w-6xl mx-auto p-8 bg-white rounded-2xl shadow-2xl border border-indigo-100">
                <h2 className="text-4xl font-extrabold text-center mb-10 text-indigo-700 tracking-tight drop-shadow-sm">Student Dashboard</h2>
                {/* Add similar professional styling to profile, job cards, and application lists below */}
                <div className="container mx-auto p-6 space-y-8">
                    {/* Profile Section */}
                    <section className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold text-gray-700">👤 {profile.name}'s Profile</h3>
                        <button
                            onClick={() => setEditMode(!editMode)}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                        >
                            {editMode ? "Cancel" : "Edit Profile"}
                        </button>

                        {editMode ? (
                            <form onSubmit={handleUpdateProfile} className="mt-4 space-y-4">
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-600">Phone</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your phone number"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-600">CGPA</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="Enter your CGPA"
                                        value={profile.cgpa}
                                        onChange={(e) => setProfile({ ...profile, cgpa: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-600">Existing Resumes</label>
                                    <ul className="list-disc list-inside text-sm">
                                        {resumes.length > 0 ? (
                                            resumes.map((resume, index) => (
                                                <li key={index}>
                                                    <a
                                                        href={resume.resume_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-blue-600 underline"
                                                    >
                                                        {resume.category || `Resume ${index + 1}`}
                                                    </a>
                                                </li>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No resumes uploaded yet.</p>
                                        )}
                                    </ul>
                                </div>

                                {/* Upload New Resumes */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-600">Add New Resumes</label>
                                    <input
                                        type="file"
                                        multiple
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files);
                                            setNewResumeFiles(files);

                                            // Initialize meta with empty categories
                                            const meta = files.map((file) => ({ filename: file.name, category: "" }));
                                            setNewResumeMeta(meta);
                                        }}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                {/* Input for category of each uploaded resume */}
                                {newResumeFiles.map((file, index) => (
                                    <div key={index} className="mt-2">
                                        <label className="block text-sm text-gray-600">
                                            Category for <span className="font-semibold">{file.name}</span>
                                        </label>
                                        <select
                                            value={newResumeMeta[index]?.category || ""}
                                            onChange={(e) => {
                                                const updatedMeta = [...newResumeMeta];
                                                updatedMeta[index] = {
                                                    filename: file.name,
                                                    category: e.target.value,
                                                };
                                                setNewResumeMeta(updatedMeta);
                                            }}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            required
                                        >
                                            <option value="" disabled>Select a category</option>
                                            <option value="Finance">Finance</option>
                                            <option value="Software">Software</option>
                                            <option value="Engineering">Engineering</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                ))}

                                <button
                                    type="submit"
                                    className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-500"
                                >
                                    Save Changes
                                </button>
                            </form>
                        ) : (
                            <div className="mt-4 space-y-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    <div className="space-y-2">
                                        <p><strong>📧 Email:</strong> {profile.email}</p>
                                        <p><strong>📞 Phone:</strong> {profile.phone}</p>
                                        <p><strong>🆔 Roll Number:</strong> {profile.rollnum}</p>
                                        <p><strong>📅 Graduation Year:</strong> {profile.graduation_year}</p>
                                        <p><strong>🎓 Course:</strong> {profile.course}</p>
                                        <p><strong>🏫 Branch:</strong> {profile.branch}</p>
                                        <div>
                                            <strong>📄 Resumes:</strong>
                                            {profile.resumes && profile.resumes.length > 0 ? (
                                                <ul className="mt-1 space-y-1 text-sm">
                                                    {profile.resumes.map((resume, index) => (
                                                        <li key={index} className="flex items-center space-x-2">
                                                            <span className="text-gray-700">• {resume.category}:</span>
                                                            <a
                                                                href={resume.resume_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-500 underline"
                                                            >
                                                                View Resume
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-sm text-gray-500 italic">No resumes uploaded yet.</p>
                                            )}
                                        </div>
                                        <p>Don't have a resume? Or want a better one? <a href="https://www.overleaf.com/latex/templates/nit-jalandhar-resume/xfjnhnxsbzbk" target="_blank" rel="noopener noreferrer" className="text-blue-500">Click here</a></p>
                                    </div>

                                    <div className="space-y-2">
                                        <p><strong>📊 CGPA:</strong> {profile.cgpa}</p>
                                        <p><strong>📌 Placement Status:</strong> {profile.placement_status_combined}</p>
                                        <p><strong>🗣️ Languages Known:</strong> {profile.languages_known?.join(", ")}</p>
                                        <p><strong>🌍 Preferred Locations:</strong> {profile.preferred_location?.join(", ")}</p>
                                        <p><strong>🛠 Skills:</strong> {profile.skills?.join(", ")}</p>
                                        <p><strong>📜 Certifications:</strong></p>
                                        <ul className="list-disc list-inside">
                                            {profile.certifications?.map((cert, idx) => (
                                                <li key={idx}>
                                                    {cert.name} — {cert.issuing_org} ({new Date(cert.issue_date).getFullYear()})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Applied Jobs Section */}
                    <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-2xl font-semibold text-gray-700 mb-6">📌 Applied Jobs</h3>
                        {appliedJobs.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">
                                <p className="text-lg">You have not applied for any jobs yet.</p>
                            </div>
                        ) : (
                            <ul className="grid gap-4 md:grid-cols-2">
                                {Array.isArray(appliedJobs) && appliedJobs.map((job) => (
                                    <li
                                        key={job._id}
                                        className="p-4 rounded-lg border border-gray-200 hover:shadow-lg transition duration-200 bg-gray-50"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-xl font-semibold text-gray-700">
                                                {job.job_id?.org_name}
                                            </h4>
                                            <span
                                                className={`text-sm font-medium px-3 py-1 rounded-full ${job.approval_status === "Selected"
                                                    ? "bg-green-100 text-green-700"
                                                    : job.approval_status === "Rejected"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {job.approval_status}
                                            </span>
                                        </div>
                                        <p className="text-gray-600">{job.job_id?.job_title} - {job.job_id?.job_type}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {/* Available Jobs Section */}
                    <section className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold text-gray-700 mb-2">📌 Available Jobs</h3>
                        <section className="bg-white p-6 rounded-lg shadow-md mb-4">
                            <h3 className="text-xl font-semibold mb-2">🎯 Filter Jobs</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                                <select value={filters.job_type} onChange={(e) => handleFilterChange('job_type', e.target.value)} className="border p-2 rounded">
                                    <option value="">All Job Types</option>
                                    <option value="Full-Time">Full-Time</option>
                                    <option value="Internship">Internship</option>
                                    <option value="PPO">PPO</option>
                                </select>
                                <select value={filters.job_category} onChange={(e) => handleFilterChange('job_category', e.target.value)} className="border p-2 rounded">
                                    <option value="">All Categories</option>
                                    <option value="Software">Software</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Design">Design</option>
                                </select>
                                <select
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="border p-2 rounded"
                                >
                                    <option value="">All Recruiter Categories</option>
                                    <option value="Govt">Govt</option>
                                    <option value="PSU">PSU</option>
                                    <option value="Private">Private</option>
                                    <option value="MNC">MNC</option>
                                    <option value="Startup">Startup</option>
                                    <option value="NGO">NGO</option>
                                    <option value="Other">Other</option>
                                </select>
                                <select
                                    value={filters.participation_type}
                                    onChange={(e) => handleFilterChange('participation_type', e.target.value)}
                                    className="border p-2 rounded"
                                >
                                    <option value="">All Participation Types</option>
                                    <option value="Virtual">Virtual</option>
                                    <option value="On-Campus">On-Campus</option>
                                </select>
                            </div>
                        </section>
                        <div className="text-sm text-gray-500 m-2">
                            Showing jobs for:
                            {filters.job_type && <span> {filters.job_type}</span>}
                            {filters.job_category && <span>, {filters.job_category}</span>}
                            {filters.category && <span>, {filters.category}</span>}
                            {filters.participation_type && <span>, {filters.participation_type}</span>}
                        </div>
                        {jobs.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">
                                <p className="text-lg">Sorry, you have no available jobs yet.</p>
                            </div>
                        ) : (
                            <ul className="space-y-4">

                                {Array.isArray(jobs) && jobs.map((job) => (
                                    <li key={job._id} className="border-b py-2">
                                        <strong>{job.org_name}</strong>
                                        <br />
                                        <strong>{job.job_title}</strong> - {job.job_description}
                                        <br />
                                        <span>📅 Deadline: {job.job_deadline}</span>
                                        <br />
                                        <span>💰 Salary: {job.compensation.fixed_salary}</span>
                                        <br />
                                        <span>🧾 Job Type: {job.job_type}</span>
                                        <br />
                                        <span className={`font-bold ${job.job_status === "Expired" ? "text-red-500" : "text-green-600"}`}>
                                            Status: {job.job_status}
                                        </span>
                                        <br />

                                        {/* Show resume selector & apply button if not expired and not applied */}
                                        {job.job_status !== "Expired" && !appliedJobs.some(appliedJob => appliedJob.job_id._id === job._id) && (
                                            <>
                                                <div className="mt-2">
                                                    <label className="block text-sm font-medium text-gray-700">Select Resume:</label>
                                                    <select
                                                        value={selectedResumes[job._id] || ''}
                                                        onChange={(e) => handleResumeChange(job._id, e.target.value)}
                                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                                        required
                                                    >
                                                        <option value="" disabled>Select a resume</option>
                                                        {profile.resumes.map((resume, index) => (
                                                            <option value={index} key={index}>
                                                                {resume.category || 'General'} - Resume {index + 1}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <button
                                                    onClick={() => handleApplyJob(job._id)}
                                                    disabled={loadingJobId === job._id || !selectedResumes[job._id]}
                                                    className={`mt-2 px-4 py-2 rounded-md text-white ${loadingJobId === job._id ? "bg-blue-400 cursor-wait" : "bg-blue-600 hover:bg-blue-500"}`}
                                                >
                                                    {loadingJobId === job._id ? "Applying..." : "Apply"}
                                                </button>
                                            </>
                                        )}

                                        {/* If expired or already applied, show appropriate button */}
                                        {job.job_status === "Expired" && (
                                            <button disabled className="mt-2 px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed">
                                                ❌ Job Expired
                                            </button>
                                        )}
                                        {appliedJobs.some(appliedJob => appliedJob.job_id._id === job._id) && (
                                            <button disabled className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-md cursor-not-allowed">
                                                ✅ Already Applied
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>

                        )}
                    </section>
                        <FeedbackModal />
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
