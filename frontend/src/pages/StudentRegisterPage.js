import React, { useState } from "react";
import customApi from "../custom-api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaGraduationCap, FaIdBadge } from "react-icons/fa";
import branchesList from "../shared/branchesList";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [rollnum, setRollnum] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [branch, setBranch] = useState("");
    const [cgpa, setCgpa] = useState("");
    const [course, setCourse] = useState("");
    const [year, setYear] = useState("");

    const [resumes, setResumes] = useState([{ category: "", file: null }]);

    const navigate = useNavigate();

    const handleResumeChange = (index, field, value) => {
        const newResumes = [...resumes];
        newResumes[index][field] = value;
        setResumes(newResumes);
    };

    const addResumeField = () => {
        setResumes([...resumes, { category: "", file: null }]);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirm_password) {
            alert("Passwords do not match");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("rollnum", rollnum);
        formData.append("password", password);
        formData.append("phone", phone);
        formData.append("branch", branch);
        formData.append("cgpa", cgpa);
        formData.append("course", course);
        formData.append("graduation_year", year);

        const resumesMeta = [];

        resumes.forEach((resumeObj) => {
            formData.append("resumes", resumeObj.file); // actual File object
            resumesMeta.push({ category: resumeObj.category }); // only category, no URL
        });

        formData.append("resumesMeta", JSON.stringify(resumesMeta)); // Append metadata as JSON string

        try {
            const response = await customApi.post("/students/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Registered successfully:", response.data);
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard/student");
            alert("Student registered successfully!");
        } catch (error) {
            alert("Registration failed: " + (error.response?.data?.error || "Unknown error"));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-4 lg:px-6">
            <div className="max-w-lg w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
                <h2 className="text-center text-4xl font-extrabold text-gray-900">🚀 Student Registration</h2>
                <form className="mt-6 space-y-4" onSubmit={handleRegister} encType="multipart/form-data">
                    {[{ label: "Full Name", value: name, setValue: setName, icon: <FaUser /> },
                    { label: "Email", value: email, setValue: setEmail, icon: <FaEnvelope />, type: "email" },
                    { label: "Password", value: password, setValue: setPassword, icon: <FaLock />, type: "password" },
                    { label: "Confirm Password", value: confirm_password, setValue: setConfirmPassword, icon: <FaLock />, type: "password" },
                    { label: "Phone Number", value: phone, setValue: setPhone, icon: <FaPhone /> },
                    { label: "Roll Number", value: rollnum, setValue: setRollnum, icon: <FaIdBadge /> },
                    { label: "CGPA", value: cgpa, setValue: setCgpa, icon: <FaGraduationCap />, type: "number" },
                    { label: "Graduation Year", value: year, setValue: setYear, icon: <FaGraduationCap />, type: "number" }]
                        .map(({ label, value, setValue, icon, type = "text" }, index) => (
                            <div key={index} className="relative">
                                <span className="absolute left-3 top-3 text-gray-600">{icon}</span>
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
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            required
                            className="w-full pl-3 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                            <option value="">Select your branch</option>
                            {branchesList.map((b) => (
                                <option key={b} value={b}>{b}</option>
                            ))}
                        </select>
                    </div>
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

                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Upload Resumes</h3>
                        {resumes.map((resume, index) => (
                            <div key={index} className="flex flex-col sm:flex-row gap-2">
                                <select
                                    value={resume.category}
                                    onChange={(e) => handleResumeChange(index, "category", e.target.value)}
                                    required
                                    className="w-full sm:w-1/2 px-3 py-2 border rounded"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Software">Software</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Other">Other</option>
                                </select>

                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => handleResumeChange(index, "file", e.target.files[0])}
                                    required
                                    className="w-full sm:w-1/2 px-3 py-2 border rounded"
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addResumeField}
                            className="text-blue-600 hover:underline text-sm"
                        >
                            + Add another resume
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 mt-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all"
                    >
                        Register Now
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">Already have an account? 
                        <button
                            type="button"
                            onClick={() => navigate('/login/student')}
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            Login here
                        </button>
                    </p>
                </div>
                <div className="text-center mt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
