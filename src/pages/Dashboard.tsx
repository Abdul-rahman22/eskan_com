"use client";

import React from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://abdo238923.pythonanywhere.com";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-12 text-center max-w-md">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">مرحباً</h1>
        <p className="text-lg text-gray-600 mb-8">أهلاً بك في لوحة التحكم</p>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-red-700 transition"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}
