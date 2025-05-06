import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import customApi from "../custom-api/axiosInstance";

const AdminDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [students, setStudents] = useState([]);
    const [recruiters, setRecruiters] = useState([]);
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

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6 text-center">📊 Admin Dashboard</h2>

            {/* Jobs Section */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h3 className="text-2xl font-semibold mt-8 mb-4">📌 Job Listings </h3>
            {jobs.length === 0 ? (
                <p className="text-gray-600 text-center">No jobs posted yet.</p>
            ) : (
                <ul className="space-y-6">
                    {jobs.map((job) => (
                        <li key={job._id} className="bg-gray-50 p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <h4 className="text-xl font-semibold">{job.org_name}</h4>
                                    <p className="text-l font-semibold">Role: {job.job_title}</p>
                                    <p className="text-sm text-gray-500">Job Description: {job.job_description}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">📅 Deadline: {job.application_deadline}</p>
                            <p className="text-sm text-gray-600">💰 Fixed Salary: {job.compensation?.fixed_salary}</p>
                            <p className="text-sm text-gray-600">🎁 Variable Salary: {job.compensation?.variable_component}</p>
                            {/* <p>{job.branches_eligible}</p> */}
                            {/* <p>{job.job_location}</p> */}
                            
                        </li>
                    ))}
                </ul>
            )}
            </div>

            {/* Students Section */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h3 className="text-2xl font-semibold mt-8 mb-4">🎓 Student Listings</h3>
            {students.length === 0 ? (
                <p className="text-gray-600 text-center">No students registered yet.</p>
            ) : (
                <ul className="space-y-6">
                    {students.map((student) => (
                        <li key={student._id} className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                            {/* Top Section: Name + Contact */}
                            <div className="flex justify-between items-center border-b pb-3 mb-3">
                                <div>
                                    <h4 className="text-lg font-semibold">Name: {student.name}</h4>
                                    <p className="text-sm text-gray-500">Roll No.: {student.roll_number}</p>
                                    <p className="text-sm text-gray-500">Phone: {student.phone}</p>
                                    <p className="text-sm text-gray-500">Email: {student.email}</p>
                                </div>
                            </div>
    
                            {/* Academic Details - Using Grid for Better Layout */}
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                <p><span className="font-medium">Course:</span> {student.course}</p>
                                <p><span className="font-medium">Graduation Year:</span> {student.graduation_year}</p>
                                <p><span className="font-medium">Branch:</span> {student.branch}</p>
                                <p><span className="font-medium">CGPA:</span> {student.cgpa}</p>
                            </div>
    
                            {/* Social Links Section */}
                            <div className="flex gap-4 mt-4">
                                {student.resume_url && (
                                    <a 
                                        href={student.resume_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline flex items-center"
                                    >
                                       📚 Resume
                                    </a>
                                )}
                                {student.linkedin_url && (
                                    <a 
                                        href={student.linkedin_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline flex items-center"
                                    >
                                        🔗 LinkedIn
                                    </a>
                                )}
                                {student.github_url && (
                                    <a 
                                        href={student.github_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-gray-800 hover:underline flex items-center"
                                    >
                                        💻 GitHub
                                    </a>
                                )}
                                {student.portfolio_url &&(
                                    <a 
                                        href={student.portfolio_url}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-gray-800 hover:underline flex items-center"
                                    >
                                        💻 Portfolio
                                    </a>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            </div>

            {/* Recruiters Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-2xl font-semibold mt-8 mb-4">🏢 Recruiter Listings</h3>
            {recruiters.length === 0 ? (
                <p className="text-gray-600 text-center">No recruiters registered yet.</p>
            ) : (
                <ul className="space-y-6">
                    {recruiters.map((recruiter) => (
                        <li key={recruiter._id} className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                            {/* Recruiter Name & Contact */}
                            <div className="flex justify-between items-center border-b pb-3 mb-3">
                                <div>
                                    <h4 className="text-xl font-semibold">{recruiter.org_name.toUpperCase()}</h4>
                                    <p className="text-sm text-gray-500">📧 Email: {recruiter.contact_email}</p>
                                    <p className="text-sm text-gray-500">📞 Phone: {recruiter.contact_phone}</p>
                                </div>
                            </div>

                            {/* Recruiter Details */}
                            <p className="text-sm text-gray-600">📍 Process: {recruiter.participation_type}</p>
                            <p className="text-sm text-gray-600">💼 Category: {recruiter.category}</p>
                            <p className="text-sm text-gray-600">🔗 Website: 
                                <a 
                                    href={recruiter.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline ml-1"
                                >
                                    Click Here
                                </a>
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
