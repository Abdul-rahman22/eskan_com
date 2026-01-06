'use client';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://abdo238923.pythonanywhere.com';

export default function WelcomePage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');
    if (!token) {
      // If no token, redirect to login
      navigate('/login');
      return;
    }

    // Fetch user data from API
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/v1/users/profile/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserName(data.first_name || data.username || 'المستخدم');
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-16">
          <h1 className="text-4xl font-bold text-white mb-2">أهلاً وسهلاً بك</h1>
          <p className="text-green-100 text-xl">مرحباً {userName}</p>
        </div>

        <div className="px-8 py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🎉 تم تسجيل الدخول بنجاح!</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              شكراً لاختيارك منصة Eskan Egypt. نحن سعداء بوجودك معنا في أفضل منصة لتأجير الشقق في الإسكندرية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <h3 className="text-xl font-bold text-green-700 mb-2">🏠 عروض مميزة</h3>
              <p className="text-gray-700">استعرض مئات الشقق المميزة المتاحة للتأجير في جميع أنحاء الإسكندرية.</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-blue-700 mb-2">⭐ احفظ المفضلة</h3>
              <p className="text-gray-700">احفظ الشقق التي تعجبك وقارن بينها بسهولة من قائمة المفضلة.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <a
              href="/"
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium py-3 px-6 rounded-lg hover:from-green-700 hover:to-emerald-700 transition text-center"
            >
              🏠 استعرض الشقق
            </a>
            <button
              onClick={() => {
                localStorage.removeItem('auth_token');
                navigate('/login');
              }}
              className="flex-1 bg-red-500 text-white font-medium py-3 px-6 rounded-lg hover:bg-red-600 transition"
            >
              تسجيل خروج
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
