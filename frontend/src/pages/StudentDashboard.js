import React, { useEffect, useState } from "react";
import customApi from "../custom-api/axiosInstance";

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
    const [loadingJobId, setLoadingJobId] = useState(null);

    useEffect(() => {
        fetchJobs();
        fetchAppliedJobs();
        fetchStudentProfile();
    }, []);

    // Fetch all jobs
    const fetchJobs = async () => {
        try {
            const { data } = await customApi.get("/jobs", {
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
        const { data: appliedJobIds } = await customApi.get("/students/applied-jobs", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const jobDetailsPromises = appliedJobIds.map((jobId) =>
            customApi.get(`/jobs/${jobId}`, {
                headers: { Authorization: `Bearer ${token}` },
            }).then((res) => res.data).catch(() => null)
        );

        const fullJobs = await Promise.all(jobDetailsPromises);
        const filtered = fullJobs.filter((j) => j !== null);
        setAppliedJobs(filtered);
    } catch (error) {
        console.error("Error fetching applied jobs", error);
    }
};


    // Fetch student profile details
    const fetchStudentProfile = async () => {
        try {
            const { data } = await customApi.get("/students/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(data);
        } catch (error) {
            console.error("Error fetching student profile", error);
        }
    };

    // Apply for a job
    const handleApplyJob = async (jobId) => {
        setLoadingJobId(jobId); //loading!!
        try {
            await customApi.post(`/jobs/${jobId}/apply`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await customApi.post(`/applications/${jobId}/apply`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            alert("Application submitted successfully!");
            fetchAppliedJobs();
        } catch (error) {
            alert("Failed to apply: " + (error.response?.data?.error || "Unknown error"));
        } finally {
            setLoadingJobId(null);  //stop loading
        }
    };

    // Handle profile update
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await customApi.put("/students/update-profile", profile, {
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
        <div className="container mx-auto p-6 space-y-8">
            <h2 className="text-3xl font-semibold text-center text-indigo-600">🎓 Student Dashboard</h2>

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
                        <input
                            type="text"
                            placeholder="Phone"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                        <input
                            type="number"
                            placeholder="CGPA"
                            value={profile.cgpa}
                            onChange={(e) => setProfile({ ...profile, cgpa: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Resume URL"
                            value={profile.resume_url}
                            onChange={(e) => setProfile({ ...profile, resume_url: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-500"
                        >
                            Save Changes
                        </button>
                    </form>
                ) : (
                    <div className="mt-4">
                        <p><strong>📞 Phone:</strong> {profile.phone}</p>
                        <p><strong>📊 CGPA:</strong> {profile.cgpa}</p>
                        <p><strong>📄 Resume:</strong> <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">View Resume</a></p>
                        <p>Don't have a resume? Or want a better resume? <a href="https://www.overleaf.com/latex/templates/nit-jalandhar-resume/xfjnhnxsbzbk" target="_blank" rel="noopener noreferrer" className="text-blue-500">Click here</a></p>
                    </div>
                )}
            </section>

            {/* Applied Jobs Section */}
            <section className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-700">📌 Applied Jobs</h3>
                {appliedJobs.length === 0 ? (
                    <p className="text-gray-500">You have not applied for any jobs yet.</p>
                ) : (
                    <ul className="space-y-4">
                        {appliedJobs.map((job) => (
                            <li key={job._id} className="border-b py-2">
                                <strong>{job.org_name}: {job.job_title}</strong> - <span>Status: {job.status || "Pending"}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Available Jobs Section */}
            <section className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-700">📌 Available Jobs</h3>
                <ul className="space-y-4">
                    {jobs.map((job) => (
                        <li key={job._id} className="border-b py-2">
                            <strong>{job.org_name}</strong>
                            <br />
                            <strong>{job.job_title}</strong> - {job.job_description}
                            <br />
                            <span>📅 Deadline: {job.application_deadline}</span>
                            <br />
                            <span>💰 Salary: {job.compensation.fixed_salary}</span>
                            <br />
                            {appliedJobs.some((appliedJob) => appliedJob._id === job._id) ? (
                                <button
                                    disabled
                                    className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-md cursor-not-allowed"
                                >
                                    ✅ Already Applied
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleApplyJob(job._id)}
                                    disabled={loadingJobId === job._id}
                                    className={`mt-2 px-4 py-2 rounded-md text-white ${
                                        loadingJobId === job._id ? "bg-blue-400 cursor-wait" : "bg-blue-600 hover:bg-blue-500"
                                    }`}
                                >
                                    {loadingJobId === job._id ? "Applying..." : "Apply"}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default StudentDashboard;
