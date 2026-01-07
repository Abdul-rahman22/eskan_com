import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://abdo238923.pythonanywhere.com';

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

  const [usernameStatus, setUsernameStatus] = useState<'idle'|'checking'|'available'|'taken'>('idle');
  const [emailStatus, setEmailStatus] = useState<'idle'|'checking'|'available'|'taken'>('idle');

  // ✅ Debounce للتحقق من username
  useEffect(() => {
    if (!username) { setUsernameStatus('idle'); return; }
    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/users/auth/check-username/?username=${username}`);
        const data = await res.json();
        setUsernameStatus(data.available ? 'available' : 'taken');
      } catch {
        setUsernameStatus('idle');
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [username]);

  // ✅ Debounce للتحقق من email
  useEffect(() => {
    if (!email) { setEmailStatus('idle'); return; }
    setEmailStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/users/auth/check-email/?email=${email}`);
        const data = await res.json();
        setEmailStatus(data.available ? 'available' : 'taken');
      } catch {
        setEmailStatus('idle');
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [email]);

  const hasError =
    usernameStatus === 'taken' ||
    emailStatus === 'taken' ||
    (password && password !== passwordConfirm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasError) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/v1/users/auth/register/`, {
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
      const data = await res.json();
      if (!res.ok) {
        setError('حدث خطأ في التسجيل');
        return;
      }
      setSuccess(true);
      localStorage.setItem('auth_token', data.token);
      setTimeout(() => { window.location.href = '/login'; }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const statusText = { checking:'جاري التحقق...', available:'✓ متاح', taken:'✗ مستخدم بالفعل' };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 w-full max-w-md rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">إنشاء حساب</h2>

        {error && <div className="mb-4 text-red-600 text-sm text-center">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-sm text-center">تم إنشاء الحساب بنجاح</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            placeholder="اسم المستخدم"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          {usernameStatus !== 'idle' && (
            <p className={`text-sm ${usernameStatus==='available'?'text-green-600':usernameStatus==='taken'?'text-red-600':'text-gray-500'}`}>
              {statusText[usernameStatus]}
            </p>
          )}

          <input
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          {emailStatus !== 'idle' && (
            <p className={`text-sm ${emailStatus==='available'?'text-green-600':emailStatus==='taken'?'text-red-600':'text-gray-500'}`}>
              {statusText[emailStatus]}
            </p>
          )}

          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="password"
            placeholder="تأكيد كلمة المرور"
            value={passwordConfirm}
            onChange={(e)=>setPasswordConfirm(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          {password && password !== passwordConfirm && (
            <p className="text-sm text-red-600">كلمات المرور غير متطابقة</p>
          )}

          <button
            disabled={loading || hasError}
            className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? 'جاري...' : 'إنشاء الحساب'}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          لديك حساب؟ <Link to="/login" className="text-green-600">تسجيل دخول</Link>
        </p>
      </div>
    </div>
  );
}
