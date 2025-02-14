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
        <div className="flex items-center justify-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-center text-3xl font-bold text-gray-900">Recruiter Registration</h2>
                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                type="text"
                                placeholder="Organization Name"
                                value={orgName}
                                onChange={(e) => setOrgName(e.target.value)}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Contact Person"
                                value={contactPerson}
                                onChange={(e) => setContactPerson(e.target.value)}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Designation"
                                value={designation}
                                onChange={(e) => setDesignation(e.target.value)}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <select
                            value={participationType}
                            onChange={(e) => setParticipationType(e.target.value)}
                            required
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="">Select Participation Type</option>
                            <option value="Virtual">Virtual</option>
                            <option value="On-Campus">On-Campus</option>
                        </select>
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="Sector"
                            value={sector}
                            onChange={(e) => setSector(e.target.value)}
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="">Select Category</option>
                            <option value="Govt">Govt</option>
                            <option value="PSU">PSU</option>
                            <option value="Private">Private</option>
                            <option value="MNC">MNC</option>
                            <option value="Startup">Startup</option>
                            <option value="NGO">NGO</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecruiterRegisterPage;
