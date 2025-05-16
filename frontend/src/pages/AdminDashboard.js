import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import customApi from "../custom-api/axiosInstance";

const AdminDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [students, setStudents] = useState([]);
    const [recruiters, setRecruiters] = useState([]);

    const [jobFilters, setJobFilters] = useState({ role: "", jobCategory: "", status:"" });
    const [studentFilters, setStudentFilters] = useState({ branch: "", course: ""});
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
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6 text-center">📊 Admin Dashboard</h2>

            {/* -------------------- JOB FILTERS -------------------- */}
            <div className="mb-4 bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-2">Filter Jobs</h3>
                <div className="grid grid-cols-3 gap-4">
                    <select onChange={e => setJobFilters(prev => ({ ...prev, role: e.target.value }))} className="p-2 border rounded">
                        <option value="">All Job Types</option>
                        {unique(jobs, "job_type").map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <select onChange={e => setJobFilters(prev => ({ ...prev, status: e.target.value }))} className="p-2 border rounded">
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Expired">Expired</option>
                    </select>
                    <select onChange={e => setJobFilters(prev => ({ ...prev, jobCategory: e.target.value }))} className="p-2 border rounded">
                        <option value="">All Categories</option>
                        {unique(jobs, "job_category").map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* -------------------- JOB LIST -------------------- */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-2xl font-semibold mb-4">📌 Job Listings </h3>
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

            {/* -------------------- STUDENT FILTERS -------------------- */}
            <div className="mb-4 bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-2">Filter Students</h3>
                <div className="grid grid-cols-2 gap-4">
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
            </div>

            {/* -------------------- STUDENT LIST -------------------- */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-2xl font-semibold mb-4">🎓 Student Listings</h3>
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
                                    <p><span className="font-medium">Placement jobCategory:</span> {student.placement_jobCategory_combined}</p>
                                    <p><span className="font-medium">Applied Jobs:</span> {student.applied_jobs.length}</p>
                                </div>
                                <div className="flex gap-4 mt-4">
                                    {student.resume_url && <a href={student.resume_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">📚 Resume</a>}
                                    {student.linkedin_url && <a href={student.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">🔗 LinkedIn</a>}
                                    {student.github_url && <a href={student.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">💻 GitHub</a>}
                                    {student.portfolio_url && <a href={student.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">💻 Portfolio</a>}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* -------------------- RECRUITER FILTERS -------------------- */}
            <div className="mb-4 bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-2">Filter Recruiters</h3>
                <div className="grid grid-cols-2 gap-4">
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
            </div>

            {/* -------------------- RECRUITER LIST -------------------- */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-4">🏢 Recruiter Listings</h3>
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
    );
};

export default AdminDashboard;
