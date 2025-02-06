import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [branch, setBranch] = useState("");
    const [cgpa, setCgpa] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        const requestData = {
            name,
            email,
            password,
            phone,
            branch,
            cgpa,
            resume_url: resumeUrl, // Ensure field matches backend schema
        };

        console.log("Sending Data:", requestData); // Debugging Line

        try {
            const { data } = await axios.post("http://localhost:5001/api/students/register", requestData);
            console.log("Registration Success:", data);
            localStorage.setItem("token", data.token);
            navigate("/dashboard");
        } catch (error) {
            console.error("Registration Error:", error.response?.data?.error || "Unknown error");
            alert("Registration failed: " + (error.response?.data?.error || "Unknown error"));
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                <input type="text" placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} required />
                <input type="number" placeholder="CGPA" value={cgpa} onChange={(e) => setCgpa(e.target.value)} required />
                <input type="text" placeholder="Resume URL" value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;
