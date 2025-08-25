import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaBlog, FaCommentDots, FaComments } from 'react-icons/fa';

function StudentDashboard() {
  const navigate = useNavigate();

  const options = [
    { label: "Student Details", path: "/student-details", icon: <FaUserGraduate size={28} /> },
    { label: "Add Blog", path: "/add-blog", icon: <FaBlog size={28} /> },
    { label: "Add Feedback", path: "/add-feedback", icon: <FaCommentDots size={28} /> },
    { label: "Chat with Admin", path: "/chat-admin", icon: <FaComments size={28} /> },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-2 text-[#262E3E]">Welcome, Student!</h1>
      <p className="mb-8 text-gray-700">Choose an option below to get started:</p>
      <div className="flex flex-col gap-8 w-full max-w-md">
        {options.map((opt) => (
          <div
            key={opt.label}
            className="bg-[#262E3E] text-white rounded-xl p-8 flex items-center gap-4 text-xl font-bold cursor-pointer shadow-lg hover:scale-105 hover:bg-blue-900 transition-all duration-200"
            onClick={() => navigate(opt.path)}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </div>
        ))}
      </div>
      {/* Example logout button */}
      <button
        className="mt-12 px-6 py-2 bg-[#FC7C2C] text-white rounded-lg font-semibold hover:bg-orange-600 transition"
        onClick={() => navigate('/login')}
      >
        Logout
      </button>
    </div>
  );
}

export default StudentDashboard;