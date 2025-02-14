import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token"); // Check if user is logged in

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/"); // Redirect to login page
    };

    return (
        <nav className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center shadow-lg">
            <h2 className="text-3xl font-bold tracking-wider cursor-pointer" onClick={() => navigate("/")}>
                CampusHire
            </h2>
            {token && ( // Show logout button only if token exists
                <button 
                    onClick={handleLogout} 
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 ease-in-out"
                >
                    Logout
                </button>
            )}
        </nav>
    );
};

export default Navbar;
