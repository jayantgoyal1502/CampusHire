import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-12">
            <div className="text-center max-w-lg p-6 bg-white rounded-xl shadow-lg">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to CampusHire</h1>
                <h3 className="text-2xl font-semibold text-gray-600 mb-4">Register as:</h3>
                <div className="mb-6">
                    <Link
                        to="/register/student"
                        className="text-xl text-blue-500 hover:text-blue-700 mr-4"
                    >
                        Student
                    </Link>
                    <span>|</span>
                    <Link
                        to="/register/recruiter"
                        className="text-xl text-blue-500 hover:text-blue-700 ml-4"
                    >
                        Recruiter
                    </Link>
                </div>
                <h3 className="text-2xl font-semibold text-gray-600 mb-4">Login as:</h3>
                <div>
                    <Link
                        to="/login/student"
                        className="text-xl text-blue-500 hover:text-blue-700 mr-4"
                    >
                        Student
                    </Link>
                    <span>|</span>
                    <Link
                        to="/login/recruiter"
                        className="text-xl text-blue-500 hover:text-blue-700 ml-4"
                    >
                        Recruiter
                    </Link>
                    <span>|</span>
                    <Link
                        to="/login/admin"
                        className="text-xl text-blue-500 hover:text-blue-700 ml-4"
                    >
                        Admin
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
