'use client';

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://abdo238923.pythonanywhere.com';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${API_BASE}/api/v1/users/auth/login/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || data.message || 'فشل تسجيل الدخول');
      }

      const data = await response.json();
      
      // تحقق من وجود token (حسب response الـ Django بتاعك)
      if (data.token || data.access) {
        localStorage.setItem('auth_token', data.token || data.access);
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);  // 1.5 ثانية تأخير للمستخدم يشوف النجاح
        return;
      } else {
        setError('لم يتم إرجاع token صالح');
      }
    } catch (err: any) {
      setError(err.message || 'خطأ في الاتصال بالشبكة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">إسكان مصر</h1>
          <p className="text-blue-100">تسجيل الدخول للوحة التحكم</p>
        </div>

        <div className="p-8">
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center">
              ✓ تم تسجيل الدخول بنجاح! جاري التوجيه...
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم المستخدم أو البريد الإلكتروني
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="أدخل اسم المستخدم أو الإيميل"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
                  جاري تسجيل الدخول...
                </span>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600 space-y-2">
            <p>
              ليس لديك حساب؟{' '}
              <Link 
                to="/register" 
                className="text-blue-600 hover:text-blue-800 font-medium underline transition"
              >
                إنشاء حساب جديد
              </Link>
            </p>
            <p className="text-xs text-gray-500">
              استخدم بياناتك من Django admin للتجربة
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
