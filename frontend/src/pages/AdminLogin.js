import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("http://localhost:5001/api/admin/login", { email, password });
            localStorage.setItem("token", data.token);
            navigate("/dashboard/admin");
        } catch (error) {
            alert("Login failed: " + (error.response?.data?.error || "Unknown error"));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 py-16">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl border border-indigo-100">
                <h2 className="text-center text-3xl font-extrabold text-indigo-700 mb-6">🔑 Admin Login</h2>
                <form className="space-y-6" onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 border border-indigo-200 rounded-lg bg-indigo-50 text-indigo-900 placeholder:text-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 border border-indigo-200 rounded-lg bg-indigo-50 text-indigo-900 placeholder:text-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                    <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300 transition-all">Login</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
