import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token"); // Check if user is logged in

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login"); // Redirect to login page
    };

    return (
        <nav style={{ padding: "10px", background: "#f8f8f8", display: "flex", justifyContent: "space-between" }}>
            <h2>CampusHire</h2>
            {token && ( // Show logout button only if token exists
                <button onClick={handleLogout} style={{ padding: "5px 10px", cursor: "pointer" }}>Logout</button>
            )}
        </nav>
    );
};

export default Navbar;
