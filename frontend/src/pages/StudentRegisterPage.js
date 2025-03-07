import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaGraduationCap, FaFileAlt, FaIdBadge } from "react-icons/fa";
import StudentResumeUpload from "../components/StudentResumeUpload";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [branch, setBranch] = useState("");
    const [cgpa, setCgpa] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");
    const [roll, setRoll] = useState("");
    const [course, setCourse] = useState("");
    const [year, setYear] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        const requestData = {
            name,
            email,
            password,
            phone,
            branch,
            graduation_year: year,
            cgpa,
            roll_number: roll,
            resume_url: resumeUrl,
        };

        try {
            const { data } = await axios.post("http://localhost:5001/api/students/register", requestData);
            localStorage.setItem("token", data.token);
            navigate("/dashboard/student");
        } catch (error) {
            alert("Registration failed: " + (error.response?.data?.error || "Unknown error"));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-4 lg:px-6">
            <div className="max-w-lg w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
                <h2 className="text-center text-4xl font-extrabold text-gray-900">🚀 Student Registration</h2>
                <form className="mt-6 space-y-4" onSubmit={handleRegister}>
                    {[{ label: "Full Name", value: name, setValue: setName, icon: <FaUser /> },
                      { label: "Email", value: email, setValue: setEmail, icon: <FaEnvelope />, type: "email" },
                      { label: "Password", value: password, setValue: setPassword, icon: <FaLock />, type: "password" },
                      { label: "Phone Number", value: phone, setValue: setPhone, icon: <FaPhone /> },
                      { label: "Roll Number", value: roll, setValue: setRoll, icon: <FaIdBadge /> },
                      { label: "Branch", value: branch, setValue: setBranch, icon: <FaGraduationCap /> },
                      { label: "CGPA", value: cgpa, setValue: setCgpa, icon: <FaGraduationCap />, type: "number" },
                      { label: "Graduation Year", value: year, setValue: setYear, icon: <FaGraduationCap />, type: "number" },
                      { label: "Resume URL", value: resumeUrl, setValue: setResumeUrl, icon: <FaFileAlt /> }]
                      .map(({ label, value, setValue, icon, type = "text" }, index) => (
                        <div key={index} className="relative">
                            <span className="absolute left-3 top-3 text-gray-500">{icon}</span>
                            <input
                                type={type}
                                placeholder={label}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                    ))}

                    <div className="relative">
                        <select
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            required
                            className="w-full pl-3 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                            <option value="">Select Course</option>
                            <option value="B.Tech">B.Tech</option>
                            <option value="M.Tech">M.Tech</option>
                            <option value="PhD">PhD</option>
                        </select>
                    </div>

                    {/* <div className="relative">
                        <StudentResumeUpload setResumeUrl={setResumeUrl} />
                    </div> */}

                    <button
                        type="submit"
                        className="w-full py-3 mt-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all"
                    >
                        Register Now
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
