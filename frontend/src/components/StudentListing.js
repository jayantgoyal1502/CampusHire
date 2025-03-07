import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentListing = ({ api_url }) => {
    const [students, setStudents] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const { data } = await axios.get(`${api_url}/students/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("API Response:", data); // Debug API response
            if (Array.isArray(data)) {
                setStudents(data);
            } else {
                console.error("Expected an array but got:", data);
                setStudents([]);
            }
        } catch (error) {
            console.error("Error fetching students", error);
        }
    };

    return (
        <>
            <h3 className="text-2xl font-semibold mt-8 mb-4">🎓 Student Listings</h3>
            {students.length === 0 ? (
                <p className="text-gray-600 text-center">No students registered yet.</p>
            ) : (
                <ul className="space-y-6">
                    {students.map((student) => (
                        <li key={student._id} className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                            {/* Top Section: Name + Contact */}
                            <div className="flex justify-between items-center border-b pb-3 mb-3">
                                <div>
                                    <h4 className="text-lg font-semibold">Name: {student.name}</h4>
                                    <p className="text-sm text-gray-500">Roll No.: {student.roll_number}</p>
                                    <p className="text-sm text-gray-500">Phone: {student.phone}</p>
                                    <p className="text-sm text-gray-500">Email: {student.email}</p>
                                </div>
                            </div>
    
                            {/* Academic Details - Using Grid for Better Layout */}
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                <p><span className="font-medium">Course:</span> {student.course}</p>
                                <p><span className="font-medium">Graduation Year:</span> {student.graduation_year}</p>
                                <p><span className="font-medium">Branch:</span> {student.branch}</p>
                                <p><span className="font-medium">CGPA:</span> {student.cgpa}</p>
                            </div>
    
                            {/* Social Links Section */}
                            <div className="flex gap-4 mt-4">
                                {student.resume_url && (
                                    <a 
                                        href={student.resume_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline flex items-center"
                                    >
                                       📚 Resume
                                    </a>
                                )}
                                {student.linkedin_url && (
                                    <a 
                                        href={student.linkedin_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline flex items-center"
                                    >
                                        🔗 LinkedIn
                                    </a>
                                )}
                                {student.github_url && (
                                    <a 
                                        href={student.github_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-gray-800 hover:underline flex items-center"
                                    >
                                        💻 GitHub
                                    </a>
                                )}
                                {student.portfolio_url &&(
                                    <a 
                                        href={student.portfolio_url}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-gray-800 hover:underline flex items-center"
                                    >
                                        💻 Portfolio
                                    </a>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
    
}

export default StudentListing;
