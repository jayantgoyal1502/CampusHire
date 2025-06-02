import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentLoginPage = () => {
    const [rollnum, setRollnum] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("https://campushire-ivb1.onrender.com/api/students/login", { rollnum, password });
            localStorage.setItem("token", data.token);
            navigate("/dashboard/student");
        } catch (error) {
            alert("Login failed: " + (error.response?.data?.error || "Unknown error"));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-16">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl border border-indigo-100">
                <h2 className="text-center text-3xl font-extrabold text-indigo-700 mb-6">Student Login</h2>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <input
                                type="rollnum"
                                placeholder="Roll Number"
                                value={rollnum}
                                onChange={(e) => setRollnum(e.target.value)}
                                required
                                className="w-full p-3 border border-indigo-200 rounded-lg bg-indigo-50 text-indigo-900 placeholder:text-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-3 border border-indigo-200 rounded-lg bg-indigo-50 text-indigo-900 placeholder:text-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300 transition-all"
                        >
                            Login
                        </button>
                    </div>
                </form>
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Don't have an account? 
                        <button 
                            onClick={() => navigate('/register/student')} 
                            className="text-indigo-600 hover:underline focus:outline-none"
                        >
                            Sign up
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

export default StudentLoginPage;
