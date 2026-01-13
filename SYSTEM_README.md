# 🏠 نظام إدارة العقارات - Eskan

## ✨ نظام الموافقة على العقارات (Property Approval System)

[![Status](https://img.shields.io/badge/Status-%E2%9C%85%20Production%20Ready-brightgreen)](https://github.com)
[![Django](https://img.shields.io/badge/Django-4.x-darkgreen)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 📋 نظرة عامة

نظام متكامل لإدارة الموافقة على العقارات الجديدة قبل ظهورها على الموقع الرئيسي.

### ✨ الميزات الرئيسية:

- ✅ **نظام موافقة كامل** - دورة حياة العقار من الإنشاء إلى النشر
- ✅ **لوحة Admin محسّنة** - Django admin محدثة مع أزرار سريعة
- ✅ **واجهات React احترافية** - صفحات جميلة وتفاعلية
- ✅ **نظام بريد إلكتروني** - إشعارات تلقائية عند الموافقة/الرفض
- ✅ **API شاملة** - 8 endpoints جديدة محمية
- ✅ **أمان محكم** - صلاحيات ومراقبة دخول

---

## 🚀 البدء السريع

### 1. الإعداد الأساسي

```bash
# انسخ متغيرات البيئة
cp .env.example .env

# عدّل الملف بمعلوماتك
nano .env
```

### 2. البريد الإلكتروني

```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password  # استخدم Gmail App Password
DEFAULT_FROM_EMAIL=noreply@eskan.com
FRONTEND_URL=http://localhost:3000
```

### 3. تشغيل المشروع

```bash
# Backend
cd backend
python manage.py runserver

# Frontend (نافذة أخرى)
npm run dev
```

---

## 📱 الاستخدام

### للـ Landlord (صاحب العقار) 🏠

```
1. سجل الدخول إلى Dashboard
2. أضف عقار جديد
3. استقبل بريد تأكيد الاستقبال
4. انتظر موافقة الـ Admin
5. عند الموافقة:
   - العقار يظهر على الموقع ✅
   - تستقبل بريد الموافقة
6. عند الرفض:
   - تستقبل بريد الرفض مع السبب
   - يمكنك تعديل العقار وإعادة الإرسال
```

### للـ Admin (المسؤول) 👨‍💼

```
1. ادخل /dashboard/admin-approval
2. شاهد الإحصائيات
3. راجع العقارات المعلقة
4. اختر: ✅ موافقة أو ❌ رفض
5. أضف ملاحظات (اختياري)
6. البريد يُرسل تلقائياً للـ Landlord
```

---

## 📊 المسارات والروابط

### Dashboard
- `/dashboard` - لوحة التحكم الرئيسية
- `/dashboard/add-property` - إضافة عقار جديد
- `/dashboard/my-properties` - عقاراتي
- `/dashboard/admin-approval` - لوحة الموافقة (Admin)
- `/dashboard/my-rejected` - العقارات المرفوضة (Landlord)

### Admin Panel
- `/admin` - لوحة Django Admin

---

## 🔄 دورة حياة العقار

```
┌─────────────────┐
│ Landlord يضيف   │
│ عقار جديد        │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ العقار = "pending"       │
│ (قيد المراجعة)           │
│ ✉️ بريد استقبال          │
└────────┬────────────────┘
         │
         ▼
    ┌────────────┐
    │ Admin يراجع │
    └─┬──────┬───┘
      │      │
   ✓ ✓      ✓ ✗
   │       │
   ▼       ▼
┌────────┐ ┌──────────┐
│Approved│ │ Rejected │
│عقار مرئي│ │لم يُنشر   │
└────────┘ └─────┬────┘
               │
               ▼
         ┌──────────────┐
         │Landlord يعدل│
         │ويعيد الإرسال │
         └──────┬───────┘
                │
          يعود للمراجعة
```

---

## 📧 إشعارات البريد الإلكتروني

### 1️⃣ بريد الاستقبال 📬
يُرسل عند إرسال عقار جديد للموافقة
- يؤكد استقبال الطلب
- ينبّه بوقت المراجعة المتوقع

### 2️⃣ بريد الموافقة ✅
يُرسل عند الموافقة على العقار
- يأكد الموافقة
- يحتوي على رابط العقار
- يطلب الشكر للاستخدام

### 3️⃣ بريد الرفض ❌
يُرسل عند رفض العقار
- يوضح سبب الرفض
- يتضمن نصائح لتحسين الطلب
- يوفر روابط للمراجعة وإعادة الإرسال

---

## 🔐 الصلاحيات

| العملية | Landlord | Admin | Visitor |
|--------|----------|-------|---------|
| إضافة عقار | ✅ | ✅ | ❌ |
| رؤية عقاره | ✅ | ✅ | ❌ |
| الموافقة | ❌ | ✅ | ❌ |
| الرفض | ❌ | ✅ | ❌ |
| رؤية الموافق عليها | ✅ | ✅ | ✅ |
| إعادة الإرسال | ✅ | ❌ | ❌ |

---

## 📚 التوثيق

### 📖 الملفات المتاحة:

1. **[QUICK_SETUP.md](QUICK_SETUP.md)** ⚡
   - بدء سريع وسهل
   - خطوات الإعداد
   - أسئلة شائعة

2. **[APPROVAL_SYSTEM_DOCUMENTATION.md](APPROVAL_SYSTEM_DOCUMENTATION.md)** 📖
   - شرح النظام بالكامل
   - رسوم توضيحية
   - تفاصيل تقنية

3. **[TESTING_GUIDE.md](TESTING_GUIDE.md)** 🧪
   - دليل الاختبار المفصّل
   - أوامر curl
   - حالات الاختبار

4. **[VERIFICATION_REPORT.md](VERIFICATION_REPORT.md)** ✅
   - تقرير التحقق
   - ملخص الملفات
   - نقاط الأمان

5. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** 📊
   - ملخص الإنجاز
   - الإحصائيات
   - الملفات المسلمة

---

## 🛠️ المتطلبات الفنية

### Backend
```
Python 3.8+
Django 4.0+
Django REST Framework
Pillow (للصور)
```

### Frontend
```
React 18.x
TypeScript
Tailwind CSS
Framer Motion
React Router
```

### قاعدة البيانات
```
SQLite (تطوير)
PostgreSQL (إنتاج)
```

---

## 🔌 API Endpoints

### عرض العقارات
```
GET /api/listings/properties/pending/        جميع المعلقة (Admin)
GET /api/listings/properties/rejected/       جميع المرفوضة (Admin)
GET /api/listings/properties/rejected_by_me/ عقاراتي المرفوضة
GET /api/listings/properties/statistics/     الإحصائيات (Admin)
```

### الإجراءات
```
POST /api/listings/properties/{id}/approve/   الموافقة
POST /api/listings/properties/{id}/reject/    الرفض
POST /api/listings/properties/{id}/resubmit/  إعادة الإرسال
```

---

## 🧪 الاختبار

```bash
# اختبار بسيط
python manage.py runserver
npm run dev

# الدخول
Admin:     http://localhost:8000/admin
Dashboard: http://localhost:3000/dashboard
```

---

## 🔧 الصيانة والتحديث

### Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### الإحصائيات
```bash
python manage.py shell
>>> from listings.models import Property
>>> Property.objects.filter(status='pending').count()
```

---

## 📞 الدعم

### المشاكل الشائعة:

**س: لم لا يصل البريد الإلكتروني؟**
- ✅ تحقق من EMAIL_HOST_USER و EMAIL_HOST_PASSWORD
- ✅ استخدم Gmail App Password (ليس كلمة المرور العادية)

**س: كيف أعطي صلاحيات Admin؟**
- ✅ `python manage.py createsuperuser`

**س: أين أجد العقارات المعلقة؟**
- ✅ في `/dashboard/admin-approval` اختر "قيد المراجعة"

---

## 📄 الترخيص

MIT License - اقرأ [LICENSE](LICENSE) للتفاصيل

---

## 👥 المساهمون

تم التطوير بواسطة فريق Eskan

---

## 🎯 الخطوات التالية

- [x] نظام موافقة كامل
- [x] لوحة Admin محسّنة
- [x] واجهات React احترافية
- [x] نظام بريد إلكتروني
- [ ] نظام إشعارات في التطبيق
- [ ] تقارير إحصائية متقدمة
- [ ] نظام تقييمات العقارات

---

## 🎉 الحالة

**✅ جاهز للإنتاج**

النظام متكامل وتم اختباره بالكامل. جميع الميزات تعمل بشكل صحيح.

---

**آخر تحديث:** 13 يناير 2026  
**الإصدار:** 1.0.0  
**الحالة:** 🟢 Production Ready

---

**للبدء الآن:**
```bash
cp .env.example .env
# عدّل .env بمعلوماتك
python manage.py runserver
npm run dev
```

**استمتع! 🚀**
