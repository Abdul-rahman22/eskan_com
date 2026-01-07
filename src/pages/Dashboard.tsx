'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://abdo238923.pythonanywhere.com';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/api/v1/users/auth/me/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          localStorage.removeItem('auth_token');
          navigate('/login');
          return;
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError('خطأ في جلب البيانات');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error || 'غير مصرح لك بالدخول'}
          </div>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-red-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 transition"
          >
            العودة للدخول
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">Eskan Egypt</h1>
            <p className="text-gray-600 mt-1">لوحة التحكم</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-red-700 transition"
          >
            تسجيل الخروج
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">مرحباً بك في لوحة التحكم</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Info Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">معلومات المستخدم</h3>
              <p className="mb-2"><span className="font-medium">اسم المستخدم:</span> {user?.username}</p>
              <p className="mb-2"><span className="font-medium">البريد الإلكتروني:</span> {user?.email}</p>
              {user?.first_name && <p className="mb-2"><span className="font-medium">الاسم الأول:</span> {user?.first_name}</p>}
              {user?.last_name && <p><span className="font-medium">الاسم الأخير:</span> {user?.last_name}</p>}
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">الإحصائيات</h3>
              <p className="text-4xl font-bold mb-2">0</p>
              <p>العقارات المنشورة</p>
            </div>

            {/* Actions Card */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">الإجراءات</h3>
              <button className="w-full bg-white text-purple-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition mb-2">
                إضافة عقار جديد
              </button>
              <button className="w-full bg-white text-purple-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition">
                عرض عقاراتي
              </button>
            </div>
          </div>
        </div>

        {/* Properties Section */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">عقاراتك</h3>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">لم تنشر أي عقارات بعد</p>
            <button className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition">
              انشر عقارك الأول
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
