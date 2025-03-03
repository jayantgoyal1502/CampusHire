import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [students, setStudents] = useState([]);
    const [recruiters, setRecruiters] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login/admin");
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data: jobData } = await axios.get("http://localhost:5001/api/admin/jobs", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setJobs(jobData);

            const { data: studentData } = await axios.get("http://localhost:5001/api/admin/students", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStudents(studentData);

            const { data: recruiterData } = await axios.get("http://localhost:5001/api/admin/recruiters", {
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
                <h3 className="text-xl font-semibold mb-4">📌 All Jobs</h3>
                {jobs.length === 0 ? <p className="text-gray-500">No jobs posted yet.</p> : (
                    <ul className="space-y-4">
                        {jobs.map((job) => (
                            <li key={job._id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                                <strong className="text-lg">{job.job_title}</strong> - <span className="text-gray-600">{job.company_id?.org_name || "Unknown Company"}</span>
                                <br />
                                <span className="text-gray-500">📅 Deadline: {job.application_deadline}</span>
                                <br />
                                <span className="text-gray-500">💰 Salary: {job.compensation?.fixed_salary}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Students Section */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">🎓 All Students</h3>
                {students.length === 0 ? <p className="text-gray-500">No students registered yet.</p> : (
                    <ul className="space-y-4">
                        {students.map((student) => (
                            <li key={student._id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                                <strong className="text-lg">{student.name}</strong> - {student.email}
                                <br />
                                <span className="text-gray-500">📚 Branch: {student.branch}</span> | <span className="text-gray-500">📊 CGPA: {student.cgpa}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Recruiters Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">🏢 All Recruiters</h3>
                {recruiters.length === 0 ? <p className="text-gray-500">No recruiters registered yet.</p> : (
                    <ul className="space-y-4">
                        {recruiters.map((recruiter) => (
                            <li key={recruiter._id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                                <strong className="text-lg">{recruiter.org_name}</strong> - {recruiter.contact_email}
                                <br />
                                <span className="text-gray-500">📞 Contact: {recruiter.contact_phone}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
