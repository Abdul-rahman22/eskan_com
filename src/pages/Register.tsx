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

// Check if passwords match
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

// Check if response status is not OK (e.g., 400, 500, etc.)
if (!response.ok) {
const errorMessage = data.error || data.errors?.toString() || 'حدث خطأ في التسجيل';
setError(errorMessage);
setLoading(false);
return;
}

// Handle successful registration
if (data.success) {
localStorage.setItem('auth_token', data.token);
setSuccess(true);

// Reset form fields
setUsername('');
setEmail('');
setPassword('');
setPasswordConfirm('');
setFirstName('');
setLastName('');

// Redirect to login after 2 seconds
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
