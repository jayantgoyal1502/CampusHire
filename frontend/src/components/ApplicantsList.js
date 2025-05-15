import React, { useState } from 'react';

const ApplicantsList = ({ applicants, jobId, handleApplicationStatus }) => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleDropdown = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (!applicants || applicants.length === 0) {
        return <p className="text-gray-600">No applicants yet.</p>;
    }

    return (
        <ul>
            {applicants.map((applicant, index) => (
                <li key={applicant._id || index} className="border-b py-2">
                    <div className="flex justify-between items-center">
                        <p className="font-medium">
                            {applicant.name} - {applicant.email} -
                            <span className={`ml-2 font-medium ${applicant.status === 'Selected' ? 'text-green-600' :
                                    applicant.status === 'Rejected' ? 'text-red-500' :
                                        'text-yellow-500'
                                }`}>
                                {applicant.status}
                            </span>
                        </p>

                        <div className="flex items-center">
                            <button
                                onClick={() => toggleDropdown(index)}
                                className="text-blue-500 underline text-sm mr-4"
                            >
                                {openIndex === index ? "Hide details" : "View details"}
                            </button>

                            {applicant.status === 'Pending' && (
                                <>
                                    <button
                                        onClick={() => handleApplicationStatus(applicant.student_id, jobId, "Selected")}
                                        className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleApplicationStatus(applicant.student_id, jobId, "Rejected")}
                                        className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 ml-2"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    {openIndex === index && (
                        <div className="bg-gray-50 mt-2 p-3 rounded-md text-sm space-y-1">
                            <p><strong>Roll No:</strong> {applicant.rollnum || "N/A"}</p>
                            <p><strong>Course:</strong> {applicant.course || "N/A"}</p>
                            <p><strong>Branch:</strong> {applicant.branch || "N/A"}</p>
                            <p><strong>CGPA:</strong> {applicant.cgpa || "N/A"}</p>
                            {applicant.resumeUrl && (
                                <p>
                                    <strong>Resume:</strong>
                                    <a
                                        href={applicant.resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline ml-1"
                                    >
                                        View ({applicant.resumeCategory || "N/A"})
                                    </a>
                                </p>
                            )}
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default ApplicantsList;
