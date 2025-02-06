import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // ✅ Import Navbar
import HomePage from "./pages/HomePage";
import StudentRegisterPage from "./pages/StudentRegisterPage";
import RecruiterRegisterPage from "./pages/RecruiterRegisterPage";
import StudentLoginPage from "./pages/StudentLoginPage";
import RecruiterLoginPage from "./pages/RecruiterLoginPage";
import AdminLogin from "./pages/AdminLogin"
import DashboardPage from "./pages/DashboardPage";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
    return (
        <div>
            <Navbar />  {/* ✅ Added Navbar globally */}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register/student" element={<StudentRegisterPage />} />
                <Route path="/register/recruiter" element={<RecruiterRegisterPage />} />
                <Route path="/login/student" element={<StudentLoginPage />} />
                <Route path="/login/recruiter" element={<RecruiterLoginPage />} />
                <Route path="/login/admin" element={<AdminLogin />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard/recruiter" element={<RecruiterDashboard />} />
                <Route path="/dashboard/student" element={<StudentDashboard />} />
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
            </Routes>
        </div>
    );
};

export default App;
