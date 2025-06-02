import React from "react";
import { Link } from "react-router-dom";
import AboutFloating from "../components/AboutFloating";

const HomePage = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 to-blue-100 py-16">
            <div className="text-center max-w-lg p-10 bg-white rounded-2xl shadow-2xl border border-indigo-100">
                <h1 className="text-5xl font-extrabold text-indigo-700 mb-8 tracking-tight drop-shadow-sm">Welcome to CampusHire</h1>
                <h3 className="text-2xl font-semibold text-indigo-600 mb-6">Register as:</h3>
                <div className="mb-8">
                    <Link
                        to="/register/student"
                        className="text-xl text-indigo-600 hover:text-indigo-800 font-semibold px-4 py-2 rounded-lg transition-colors duration-150 hover:bg-indigo-50"
                    >
                        Student
                    </Link>
                    <span className="mx-2 text-gray-400">|</span>
                    <Link
                        to="/register/recruiter"
                        className="text-xl text-indigo-600 hover:text-indigo-800 font-semibold px-4 py-2 rounded-lg transition-colors duration-150 hover:bg-indigo-50"
                    >
                        Recruiter
                    </Link>
                </div>
                <h3 className="text-2xl font-semibold text-indigo-600 mb-6">Login as:</h3>
                <div>
                    <Link
                        to="/login/student"
                        className="text-xl text-indigo-600 hover:text-indigo-800 font-semibold px-4 py-2 rounded-lg transition-colors duration-150 hover:bg-indigo-50"
                    >
                        Student
                    </Link>
                    <span className="mx-2 text-gray-400">|</span>
                    <Link
                        to="/login/recruiter"
                        className="text-xl text-indigo-600 hover:text-indigo-800 font-semibold px-4 py-2 rounded-lg transition-colors duration-150 hover:bg-indigo-50"
                    >
                        Recruiter
                    </Link>
                    <span className="mx-2 text-gray-400">|</span>
                    <Link
                        to="/login/admin"
                        className="text-xl text-indigo-600 hover:text-indigo-800 font-semibold px-4 py-2 rounded-lg transition-colors duration-150 hover:bg-indigo-50"
                    >
                        Admin
                    </Link>
                </div>
                <AboutFloating />
            </div>
        </div>
    );
};

export default HomePage;
