# 🚀 بدء سريع - نظام الموافقة على العقارات

## ✅ ما تم إنجازه

تم تطوير **نظام متكامل للموافقة على العقارات** يشمل:
- لوحة Admin محسّنة في Django
- صفحات React متقدمة للـ Admin والـ Landlord
- نظام بريد إلكتروني تلقائي
- API endpoints شاملة

---

## 🔧 الإعداد السريع

### 1️⃣ نسخ متغيرات البيئة

```bash
# في مجلد backend
cp .env.example .env
```

ثم عدّل الملف وأضف:
```env
# البريد الإلكتروني
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@eskan.com
FRONTEND_URL=http://localhost:3000
```

### 2️⃣ تشغيل المشروع

```bash
# Backend
cd backend
python manage.py runserver

# Frontend (في نافذة أخرى)
npm run dev
```

### 3️⃣ تسجيل الدخول

- **كـ Admin:** 
  ```bash
  python manage.py createsuperuser
  # اذهب إلى http://localhost:8000/admin
  ```

- **كـ Landlord:**
  - سجل حساب جديد مع `user_type='landlord'`

---

## 📱 رحلة الاستخدام

### للـ Landlord 🏠

```
1. سجل الدخول
2. ادهب إلى Dashboard
3. أضف عقار جديد
4. ✉️ ستستقبل بريد تأكيد الاستقبال
5. انتظر الموافقة من الـ Admin...
6. في حالة الموافقة:
   - ✅ العقار يظهر على الموقع
   - 📧 بريد موافقة
7. في حالة الرفض:
   - ❌ بريد الرفض مع السبب
   - اذهب إلى "العقارات المرفوضة"
   - عدّل العقار وأعد الإرسال
```

### للـ Admin 👨‍💼

```
1. ادخل لوحة الموافقة: /dashboard/admin-approval
2. شاهد الإحصائيات
3. اختر علامة تبويب "قيد المراجعة"
4. راجع كل عقار بالتفاصيل الكاملة
5. أضف ملاحظات (اختيارية)
6. اختر: ✅ موافقة أو ❌ رفض
7. ✉️ بريد تلقائي للـ Landlord
```

---

## 📊 الإحصائيات المتاحة

في `/dashboard/admin-approval` ستجد:
- 📊 إجمالي العقارات
- ⏳ قيد المراجعة
- ✅ موافق عليها
- ❌ مرفوضة
- 📝 مسودات

---

## 📧 إعداد Gmail

إذا كنت تستخدم Gmail:

1. فعّل 2-Step Verification
2. اذهب إلى: https://myaccount.google.com/apppasswords
3. اختر "Mail" و "Windows Computer"
4. انسخ الكلمة (16 حرف)
5. ضعها في `EMAIL_HOST_PASSWORD`

---

## 🔍 اختبار البريد الإلكتروني

للاختبار بدون بريد فعلي:
```env
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

البريد سيطبع في console

---

## 📚 المزيد من المعلومات

اقرأ الملفات:
- [APPROVAL_SYSTEM_DOCUMENTATION.md](APPROVAL_SYSTEM_DOCUMENTATION.md) - التوثيق الكامل
- [VERIFICATION_REPORT.md](VERIFICATION_REPORT.md) - تقرير التحقق

---

## ❓ الأسئلة الشائعة

**س: لم لا أستقبل البريد الإلكتروني؟**
- ج: تأكد من `EMAIL_HOST_USER` و `EMAIL_HOST_PASSWORD`
- ج: استخدم Gmail App Password وليس كلمة المرور العادية

**س: كيف أجعل مستخدم Admin؟**
- ج: `python manage.py createsuperuser`

**س: كيف أضيف Landlord جديد؟**
- ج: سجل حساب جديد واختر `user_type='landlord'`

**س: أين أجد العقارات المعلقة؟**
- ج: في `/dashboard/admin-approval` اختر "قيد المراجعة"

---

## 🎯 الخطوات التالية

- [ ] اختبر البريد الإلكتروني
- [ ] أضف عقار جديد كـ Landlord
- [ ] الموافقة/الرفض كـ Admin
- [ ] تحقق من البريد الإلكتروني
- [ ] اختبر إعادة الإرسال

---

**كل شيء جاهز! ابدأ الآن 🚀**
