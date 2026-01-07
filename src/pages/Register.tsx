'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://abdo238923.pythonanywhere.com';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // ممكن تسيب التشيك ده أو تعتمد على الباك إند بس
    if (password !== passwordConfirm) {
      setError('كلمات المرور غير متطابقة');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/v1/users/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          password_confirm: passwordConfirm,
          first_name: firstName,
          last_name: lastName,
        }),
      });

      const data = await response.json();

      // لو في أخطاء validation من Django REST
      if (!response.ok) {
        // 1) خطأ في اسم المستخدم (مكرر أو فورمات)
        if (data.username) {
          const msg = Array.isArray(data.username) ? data.username[0] : data.username;
          setError(msg || 'هناك مشكلة في اسم المستخدم');
        }
        // 2) خطأ في الإيميل (مكرر)
        else if (data.email) {
          const msg = Array.isArray(data.email) ? data.email[0] : data.email;
          setError(msg || 'هناك مشكلة في البريد الإلكتروني');
        }
        // 3) خطأ في الباسورد (زي "Passwords do not match.")
        else if (data.password) {
          const msg = Array.isArray(data.password) ? data.password[0] : data.password;
          setError(msg || 'هناك مشكلة في كلمة المرور');
        }
        // 4) لو الـ validate رجّع dict في key واحد
        else if (data.error) {
          setError(
            typeof data.error === 'string'
              ? data.error
              : JSON.stringify(data.error)
          );
        }
        // 5) fallback لأي حالة غير متوقعة
        else {
          setError('حدث خطأ في التسجيل');
        }

        setLoading(false);
        return;
      }

      // في حالة النجاح (ظبط ده حسب شكل الريسبونس اللي عندك)
      if (data.success) {
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
        }

        setSuccess(true);

        // مسح الحقول
        setUsername('');
        setEmail('');
        setPassword('');
        setPasswordConfirm('');
        setFirstName('');
        setLastName('');

        // توجيه لصفحة تسجيل الدخول
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        // لو انت في الباك إند مش مرجع success ومرجع errors بس
        setError(data.error || JSON.stringify(data.errors));
      }
    } catch (err) {
      console.error('Registration error:', err);
      // دي بتطلع بس لو النت أو السيرفر فعلاً فيهم مشكلة
      setError('خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-12">
          <h1 className="text-3xl font-bold text-white">Eskan Egypt</h1>
          <p className="text-green-100 mt-2">إنشاء حساب</p>
        </div>

        <div className="px-8 py-8">
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              ✓ تم إنشاء الحساب بنجاح! برجاء الانتظار...
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="الاسم الأول"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="الاسم الأخير"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="اسم المستخدم"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="البريد الإلكتروني"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="كلمة المرور (8+ أحرف)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />

            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              placeholder="تأكيد كلمة المرور"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium py-2 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50"
            >
              {loading ? 'جاري...' : 'إنشاء الحساب'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              لديك حساب؟{' '}
              <Link to="/login" className="text-green-600 hover:text-green-800 font-medium">
                تسجيل دخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
