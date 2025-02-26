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
        <div>
            <h2>📊 Admin Dashboard</h2>

            {/* Jobs Section */}
            <h3>📌 All Jobs</h3>
            {jobs.length === 0 ? <p>No jobs posted yet.</p> : (
                <ul>
                    {jobs.map((job) => (
                        <li key={job._id}>
                            <strong>{job.job_title}</strong> - {job.company_id?.org_name || "Unknown Company"}
                            <br />
                            <span>📅 Deadline: {job.application_deadline}</span>
                            <br />
                            <span>💰 Salary: {job.compensation?.fixed_salary}</span>
                        </li>
                    ))}
                </ul>
            )}

            {/* Students Section */}
            <h3>🎓 All Students</h3>
            {students.length === 0 ? <p>No students registered yet.</p> : (
                <ul>
                    {students.map((student) => (
                        <li key={student._id}>
                            <strong>{student.name}</strong> - {student.email}
                            <br />
                            <span>📚 Branch: {student.branch}</span> | <span>📊 CGPA: {student.cgpa}</span>
                        </li>
                    ))}
                </ul>
            )}

            {/* Recruiters Section */}
            <h3>🏢 All Recruiters</h3>
            {recruiters.length === 0 ? <p>No recruiters registered yet.</p> : (
                <ul>
                    {recruiters.map((recruiter) => (
                        <li key={recruiter._id}>
                            <strong>{recruiter.org_name}</strong> - {recruiter.contact_email}
                            <br />
                            <span>📞 Contact: {recruiter.contact_phone}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminDashboard;
