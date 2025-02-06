import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div>
            <h1>Welcome to CampusHire</h1>
            <h3>Register as:</h3>
            <Link to="/register/student">Student</Link> | <Link to="/register/recruiter">Recruiter</Link>
            <br />
            <h3>Login as:</h3>
            <Link to="/login/student">Student</Link> | <Link to="/login/recruiter">Recruiter</Link>
        </div>
    );
};

export default HomePage;
