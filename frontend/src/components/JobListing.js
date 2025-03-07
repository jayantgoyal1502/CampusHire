import React, { useEffect, useState } from "react";
import axios from "axios";

const JobListing = ({api_url}) => {
    const [jobs, setJobs] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchJobs();
    },[]);

    const fetchJobs = async () => {
        try {
            const { data } = await axios.get(`${api_url}/jobs/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setJobs(data);
        } catch (error) {
            console.error("Error fetching jobs", error);
        }
    };

    return ( 
        <>
            <h3 className="text-2xl font-semibold mt-8 mb-4">📌 Job Listings </h3>
            {jobs.length === 0 ? (
                <p className="text-gray-600 text-center">No jobs posted yet.</p>
            ) : (
                <ul className="space-y-6">
                    {jobs.map((job) => (
                        <li key={job._id} className="bg-gray-50 p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <h4 className="text-xl font-semibold">{job.org_name}</h4>
                                    <p className="text-l font-semibold">Role: {job.job_title}</p>
                                    <p className="text-sm text-gray-500">Job Description: {job.job_description}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">📅 Deadline: {job.application_deadline}</p>
                            <p className="text-sm text-gray-600">💰 Fixed Salary: {job.compensation?.fixed_salary}</p>
                            <p className="text-sm text-gray-600">🎁 Variable Salary: {job.compensation?.variable_component}</p>
                            {/* <p>{job.branches_eligible}</p> */}
                            {/* <p>{job.job_location}</p> */}
                            
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};

export default JobListing;
