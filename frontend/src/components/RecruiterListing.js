import React, { useEffect, useState } from "react";
import axios from "axios";

const RecruiterListing = ({ api_url }) => {
    const [recruiters, setRecruiters] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchRecruiters();
    }, []);

    const fetchRecruiters = async () => {
        try {
            const { data } = await axios.get(`${api_url}/recruiters/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRecruiters(data);
        } catch (error) {
            console.error("Error fetching recruiters", error);
        }
    };

    return (
        <>
            <h3 className="text-2xl font-semibold mt-8 mb-4">🏢 Recruiter Listings</h3>
            {recruiters.length === 0 ? (
                <p className="text-gray-600 text-center">No recruiters registered yet.</p>
            ) : (
                <ul className="space-y-6">
                    {recruiters.map((recruiter) => (
                        <li key={recruiter._id} className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                            {/* Recruiter Name & Contact */}
                            <div className="flex justify-between items-center border-b pb-3 mb-3">
                                <div>
                                    <h4 className="text-xl font-semibold">{recruiter.org_name.toUpperCase()}</h4>
                                    <p className="text-sm text-gray-500">📧 Email: {recruiter.contact_email}</p>
                                    <p className="text-sm text-gray-500">📞 Phone: {recruiter.contact_phone}</p>
                                </div>
                            </div>

                            {/* Recruiter Details */}
                            <p className="text-sm text-gray-600">📍 Process: {recruiter.participation_type}</p>
                            <p className="text-sm text-gray-600">💼 Category: {recruiter.category}</p>
                            <p className="text-sm text-gray-600">🔗 Website: 
                                <a 
                                    href={recruiter.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline ml-1"
                                >
                                    Click Here
                                </a>
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};

export default RecruiterListing;
