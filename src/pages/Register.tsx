'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  
  // حالات فحص اسم المستخدم
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  // دالة فحص توفر اسم المستخدم
  const checkUsernameAvailability = useCallback(async (usernameToCheck: string) => {
    if (usernameToCheck.length < 3) {
      setUsernameAvailable(null);
      setUsernameError(null);
      return;
    }

    setCheckingUsername(true);
    setUsernameError(null);

    try {
      const response = await fetch(`${API_BASE}/api/v1/users/check-username/?username=${encodeURIComponent(usernameToCheck)}`);
      const data = await response.json();

      if (response.ok && data.available === false) {
        setUsernameAvailable(false);
        setUsernameError('اسم المستخدم موجود بالفعل');
      } else if (response.ok && data.available === true) {
        setUsernameAvailable(true);
        setUsernameError(null);
      } else {
        setUsernameAvailable(null);
        setUsernameError(data.error || 'خطأ في فحص اسم المستخدم');
      }
    } catch (err) {
      setUsernameAvailable(null);
      setUsernameError('خطأ في الاتصال');
    } finally {
      setCheckingUsername(false);
    }
  }, []);

  // فحص اسم المستخدم عند تغيير القيمة
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkUsernameAvailability(username);
    }, 500); // تأخير 500ms لتجنب طلبات كثيرة

    return () => clearTimeout(timeoutId);
  }, [username, checkUsernameAvailability]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // فحص اسم المستخدم قبل الإرسال
    if (usernameError || usernameAvailable === false) {
      setError('اسم المستخدم غير متاح');
      return;
    }

    if (!usernameAvailable) {
      setError('يرجى الانتظار حتى يتم فحص اسم المستخدم');
      return;
    }

    setLoading(true);
    setError(null);

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

      if (!response.ok) {
        const errorMessage = data.error || data.errors?.toString() || 'حدث خطأ في التسجيل';
        setError(errorMessage);
        setLoading(false);
        return;
      }

      if (data.success) {
        localStorage.setItem('auth_token', data.token);
        setSuccess(true);
        
        setUsername('');
        setEmail('');
        setPassword('');
        setPasswordConfirm('');
        setFirstName('');
        setLastName('');
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setError(data.error || JSON.stringify(data.errors));
      }
    } catch (err) {
      console.error('Registration error:', err);
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

            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameError(null);
                  setUsernameAvailable(null);
                }}
                required
                placeholder="اسم المستخدم"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                  usernameError 
                    ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                    : usernameAvailable === true 
                    ? 'border-green-300 focus:ring-green-500 bg-green-50' 
                    : 'border-gray-300 focus:ring-green-500'
                }`}
              />
              {checkingUsername && (
                <p className="mt-1 text-xs text-gray-500 flex items-center">
                  <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600 mr-1"></span>
                  جاري الفحص...
                </p>
              )}
              {usernameError && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {usernameError}
                </p>
              )}
              {usernameAvailable === true && (
                <p className="mt-1 text-xs text-green-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  اسم المستخدم متاح
                </p>
              )}
            </div>

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
              disabled={loading || checkingUsername || usernameAvailable === false}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium py-2 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
