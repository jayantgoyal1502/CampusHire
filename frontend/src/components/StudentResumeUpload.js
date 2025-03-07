import React, { useState } from "react";
import axios from "axios";
import { FaFileUpload } from "react-icons/fa";

const StudentResumeUpload = ({ setResumeUrl }) => {
    const [selectedFiles, setSelectedFiles] = useState({});
    const [uploading, setUploading] = useState(false);
    const [resumeLinks, setResumeLinks] = useState({
        Software: "",
        Engineering: "",
        Finance: "",
        Other: "",
    });

    const handleFileChange = (e, category) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFiles((prev) => ({ ...prev, [category]: file }));
        }
    };

    const handleUpload = async (category) => {
        if (!selectedFiles[category]) {
            alert("Please select a file first!");
            return;
        }
    
        setUploading(true);
        const formData = new FormData();
        formData.append("resume", selectedFiles[category]);
        formData.append("category", category); // Add category field
    
        try {
            const { data } = await axios.post(
                "http://localhost:5001/api/students/upload-resume",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
    
            setResumeLinks((prev) => ({ ...prev, [category]: data.fileUrl }));
            setResumeUrl((prev) => ({ ...prev, [category]: data.fileUrl })); // Update parent state
        } catch (error) {
            console.error("Upload failed:", error.response?.data || error.message);
            alert("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };
    

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">📄 Upload Resumes</h3>

            {["Software", "Engineering", "Finance", "Other"].map((category) => (
                <div key={category} className="relative border border-gray-300 rounded-lg p-3 flex items-center shadow-sm">
                    <FaFileUpload className="text-gray-500 mr-3" />
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange(e, category)}
                        className="w-full text-sm focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => handleUpload(category)}
                        disabled={uploading}
                        className="ml-3 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700"
                    >
                        {uploading ? "Uploading..." : `Upload ${category}`}
                    </button>
                </div>
            ))}

            {/* Show uploaded links */}
            {Object.entries(resumeLinks).map(([category, url]) =>
                url ? (
                    <p key={category} className="text-sm text-gray-600">
                        ✅ {category} Resume Uploaded:{" "}
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                            View
                        </a>
                    </p>
                ) : null
            )}
        </div>
    );
};

export default StudentResumeUpload;
