import React, { useState } from "react";

const AboutFloatingModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating About Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-700"
      >
        About
      </button>

      {/* Fullscreen Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-[80%] max-h-[90%] rounded-xl shadow-xl p-8 overflow-y-auto relative">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>

            {/* Modal Content */}
            <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">About CampusHire</h2>
            <p className="text-gray-700 text-sm text-left leading-6">
              <strong>CampusHire</strong> is a comprehensive campus placement portal developed to streamline the hiring process for students, recruiters, and administrators. Built with a clean and user-friendly interface, the platform offers dedicated dashboards for each user role and is continuously improved based on user's needs.

              <br /><br />
              <strong className="text-blue-600">📌 Rules & Guidelines</strong>
              <ul className="list-none ml-6 mt-2">
                <li><strong>Students</strong> will only see jobs applicable to their branch and course</li>
                <li><strong>Each student</strong> is allowed one offer per type: Internship, PPO, and Full-time</li>
                <li><strong>Students</strong> must upload at least one resume for each domain (Core, Tech, Others) to apply accordingly</li>
                <li><strong>Admins</strong> and <strong>Recruiters</strong> should ensure job listings have correct eligibility and status info</li>
                <li>Expired jobs will be hidden or removed from dashboards automatically</li>
                <li>Fake or invalid contact information (email, phone, etc.) may lead to rejection</li>
                <li>Feedback is encouraged and can be submitted by authenticated users</li>
              </ul>

              <br />
              <strong className="text-blue-600">🔑 Key Features</strong>
              <ul className="list-none ml-6 mt-2">
                <li>Role-specific dashboards for Students, Recruiters, and Admins</li>
                <li>Eligibility-based job visibility based on branch and course</li>
                <li>Support for multiple resumes with option to update anytime</li>
                <li>Resume selection during job application (Core, Tech, Others)</li>
                <li>Recruiters can accept or reject applications; statuses visible to students</li>
                <li>Accepted candidates automatically tagged as <em>Placed</em> (via virtual fields)</li>
                <li>Expired jobs automatically tagged as inactive or removed</li>
                <li>Dynamic filters for jobs and student listings (Admin/Student dashboards)</li>
                <li>Email alerts to Admin when a student applies for a job</li>
                <li>Loader feedback during application process (improved UX)</li>
                <li>Session handling: users redirected to home upon expiry</li>
              </ul>

              <br />
              <strong className="text-blue-600">🚀 Recent Improvements (Mar–May 2025)</strong>
              <ul className="list-none ml-6 mt-2">
                <li>MongoDB Atlas integration for cloud-based database access</li>
                <li>Expanded schemas with detailed field validation (URLs, emails, phone numbers)</li>
                <li>Password strength validation and confirm-password on login</li>
                <li>Tailwind CSS integration for cleaner and modern frontend</li>
                <li>Enhanced input fields on all registration pages</li>
                <li>Cleaner UI/UX on all dashboards with additional student/job info</li>
              </ul>

              <br />
              <strong className="text-blue-600">🛠️ Work in Progress</strong><br />
              The platform is still evolving, with more improvements and scalability features planned. Your feedback and support help us build a more efficient and inclusive hiring experience for all users!
            </p>

          </div>
        </div>
      )}
    </>
  );
};

export default AboutFloatingModal;
