import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RecruiterRegisterPage = () => {
    const [orgName, setOrgName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [designation, setDesignation] = useState("");
    const [phone, setPhone] = useState("");
    const [participationType, setParticipationType] = useState("");
    const [sector, setSector] = useState("");
    const [category, setCategory] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        const requestData = {
            org_name: orgName,
            contact_email: email,
            password,
            contact_name: contactPerson,
            contact_designation: designation,
            contact_phone: phone,  // ✅ Required field
            participation_type: participationType, // ✅ Required field
            sector: sector,  // ✅ Required field
            category: category, // ✅ Required field
        };

        console.log("Sending Data:", requestData);

        try {
            const { data } = await axios.post("http://localhost:5001/api/recruiters/register", requestData);
            console.log("Registration Success:", data);
            localStorage.setItem("token", data.token);
            navigate("/dashboard/recruiter");
        } catch (error) {
            console.error("Registration Error:", error.response?.data?.error || "Unknown error");
            alert("Registration failed: " + (error.response?.data?.error || "Unknown error"));
        }
    };

    return (
        <div>
            <h2>Recruiter Registration</h2>
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="Organization Name" value={orgName} onChange={(e) => setOrgName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input type="text" placeholder="Contact Person" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} required />
                <input type="text" placeholder="Designation" value={designation} onChange={(e) => setDesignation(e.target.value)} required />
                <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />

                <select value={participationType} onChange={(e) => setParticipationType(e.target.value)} required>
                    <option value="">Select Participation Type</option>
                    <option value="Virtual">Virtual</option>
                    <option value="On-Campus">On-Campus</option>
                </select>

                <input type="text" placeholder="Sector" value={sector} onChange={(e) => setSector(e.target.value)} required />

                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="">Select Category</option>
                    <option value="Govt">Govt</option>
                    <option value="PSU">PSU</option>
                    <option value="Private">Private</option>
                    <option value="MNC">MNC</option>
                    <option value="Startup">Startup</option>
                    <option value="NGO">NGO</option>
                    <option value="Other">Other</option>
                </select>

                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RecruiterRegisterPage;
