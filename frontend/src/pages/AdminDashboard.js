import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import customApi from "../custom-api/axiosInstance";

const AdminDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [students, setStudents] = useState([]);
    const [recruiters, setRecruiters] = useState([]);

    const [jobFilters, setJobFilters] = useState({ role: "", jobCategory: "", status: "" });
    const [studentFilters, setStudentFilters] = useState({ branch: "", course: "" });
    const [recruiterFilters, setRecruiterFilters] = useState({ category: "", participation: "" });

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/");
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data: jobData } = await customApi.get("/admin/jobs", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setJobs(jobData);

            const { data: studentData } = await customApi.get("/admin/students", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStudents(studentData);

            const { data: recruiterData } = await customApi.get("/admin/recruiters", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRecruiters(recruiterData);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        }
    };

    const filteredJobs = jobs.filter(job => {
        return (
            (jobFilters.role === "" || job.job_type === jobFilters.role) &&
            (jobFilters.status === "" || job.job_status === jobFilters.status) &&
            (jobFilters.jobCategory === "" || job.job_category === jobFilters.jobCategory)
        );
    });

    const filteredStudents = students.filter(student => {
        return (
            (studentFilters.branch === "" || student.branch === studentFilters.branch) &&
            (studentFilters.course === "" || student.course === studentFilters.course)
        );
    });

    const filteredRecruiters = recruiters.filter(recruiter => {
        return (
            (recruiterFilters.category === "" || recruiter.category === recruiterFilters.category) &&
            (recruiterFilters.participation === "" || recruiter.participation_type === recruiterFilters.participation)
        );
    });

    // Get unique values for dropdowns
    const unique = (arr, key) => [...new Set(arr.map(item => item[key]))];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-10">
            <div className="max-w-6xl mx-auto p-8 bg-white rounded-2xl shadow-2xl border border-indigo-100">
                <h2 className="text-4xl font-extrabold text-center mb-10 text-indigo-700 tracking-tight drop-shadow-sm">Admin Dashboard</h2>
                {/* Add similar professional styling to filters, tables, and cards below */}

                {/* -------------------- JOBS -------------------- */}
                <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <h3 className="text-2xl font-bold mb-6">📌 Job Listings</h3>
                    <h4 className="font-semibold text-xl mb-4">Filter Jobs</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                            <select
                                onChange={e => setJobFilters(prev => ({ ...prev, role: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Job Types</option>
                                {unique(jobs, "job_type").map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                onChange={e => setJobFilters(prev => ({ ...prev, status: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Expired">Expired</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                onChange={e => setJobFilters(prev => ({ ...prev, jobCategory: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Categories</option>
                                {unique(jobs, "job_category").map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {filteredJobs.length === 0 ? (
                        <p className="text-gray-600 text-center">No matching jobs.</p>
                    ) : (
                        <ul className="space-y-6">
                            {filteredJobs.map((job) => (
                                <li key={job._id} className="bg-gray-50 p-6 rounded-lg shadow-md">
                                    <div className="flex justify-between items-center mb-3">
                                        <div>
                                            <h4 className="text-xl font-semibold">{job.org_name}</h4>
                                            <p className="text-l font-semibold">Role: {job.job_title}</p>
                                            <p className="text-sm text-gray-500">Job Description: {job.job_description}</p>
                                            <p className={job.job_status === "Expired" ? "text-red-500" : "text-green-600"}>
                                                {job.job_status}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">📅 Deadline: {job.job_deadline}</p>
                                    <p className="text-sm text-gray-600">💰 Fixed Salary: {job.compensation?.fixed_salary}</p>
                                    <p className="text-sm text-gray-600">🎁 Variable Salary: {job.compensation?.variable_component}</p>
                                    <p className="text-sm text-gray-600">👥 Applicants: {job.applicants.length}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* -------------------- STUDENTS -------------------- */}
                <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <h3 className="text-2xl font-bold mb-4">🎓 Student Listings</h3>
                    <h3 className="font-semibold text-lg mb-4">Filter Students</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <select onChange={e => setStudentFilters(prev => ({ ...prev, branch: e.target.value }))} className="p-2 border rounded">
                            <option value="">All Branches</option>
                            {unique(students, "branch").map(branch => (
                                <option key={branch} value={branch}>{branch}</option>
                            ))}
                        </select>
                        <select onChange={e => setStudentFilters(prev => ({ ...prev, course: e.target.value }))} className="p-2 border rounded">
                            <option value="">All Courses</option>
                            {unique(students, "course").map(course => (
                                <option key={course} value={course}>{course}</option>
                            ))}
                        </select>
                    </div>
                    {filteredStudents.length === 0 ? (
                        <p className="text-gray-600 text-center">No matching students.</p>
                    ) : (
                        <ul className="space-y-6">
                            {filteredStudents.map(student => (
                                <li key={student._id} className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                                    <div className="flex justify-between items-center border-b pb-3 mb-3">
                                        <div>
                                            <h4 className="text-lg font-semibold">Name: {student.name}</h4>
                                            <p className="text-sm text-gray-600">Roll No.: {student.rollnum}</p>
                                            <p className="text-sm text-gray-600">Phone: {student.phone}</p>
                                            <p className="text-sm text-gray-600">Email: {student.email}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1 text-sm text-gray-600">
                                        <p><span className="font-medium">Course:</span> {student.course}</p>
                                        <p><span className="font-medium">Graduation Year:</span> {student.graduation_year}</p>
                                        <p><span className="font-medium">Branch:</span> {student.branch}</p>
                                        <p><span className="font-medium">CGPA:</span> {student.cgpa}</p>
                                        <p><span className="font-medium">Placement status:</span> {student.placement_status_combined}</p>
                                        <p><span className="font-medium">Applied Jobs:</span> {student.applied_jobs.length}</p>
                                    </div>
                                    <div className="flex gap-4 mt-4">
                                        {/* {student.resume_url && <a href={student.resume_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">📚 Resume</a>} */}
                                        {student.linkedin_url && <a href={student.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">🔗 LinkedIn</a>}
                                        {student.github_url && <a href={student.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">💻 GitHub</a>}
                                        {student.portfolio_url && <a href={student.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">💻 Portfolio</a>}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* -------------------- RECRUITERS -------------------- */}
                <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <h3 className="text-2xl font-bold mb-6">🏢 Recruiter Listings</h3>
                    <h3 className="font-semibold text-xl mb-4">Filter Recruiters</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <select onChange={e => setRecruiterFilters(prev => ({ ...prev, category: e.target.value }))} className="p-2 border rounded">
                            <option value="">All Categories</option>
                            {unique(recruiters, "category").map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <select onChange={e => setRecruiterFilters(prev => ({ ...prev, participation: e.target.value }))} className="p-2 border rounded">
                            <option value="">All Participation Types</option>
                            {unique(recruiters, "participation_type").map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {filteredRecruiters.length === 0 ? (
                        <p className="text-gray-600 text-center">No matching recruiters.</p>
                    ) : (
                        <ul className="space-y-6">
                            {filteredRecruiters.map(recruiter => (
                                <li key={recruiter._id} className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                                    <div className="flex justify-between items-center border-b pb-3 mb-3">
                                        <div>
                                            <h4 className="text-xl font-semibold">{recruiter.org_name.toUpperCase()}</h4>
                                            <p className="text-sm text-gray-500">📧 Email: {recruiter.contact_email}</p>
                                            <p className="text-sm text-gray-500">📞 Phone: {recruiter.contact_phone}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">📍 Process: {recruiter.participation_type}</p>
                                    <p className="text-sm text-gray-600">💼 Category: {recruiter.category}</p>
                                    <p className="text-sm text-gray-600">🔗 Website:
                                        <a href={recruiter.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">Click Here</a>
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
