import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RecruiterLoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("http://localhost:5001/api/recruiters/login", { contact_email: email, password });
            localStorage.setItem("token", data.token);
            navigate("/dashboard/recruiter");
        } catch (error) {
            alert("Login failed: " + (error.response?.data?.error || "Unknown error"));
        }
    };

    return (
        <div>
            <h2>Recruiter Login</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default RecruiterLoginPage;
