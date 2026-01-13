# نظام إدارة الموافقة على العقارات 🏠✅

## 📋 نظرة عامة

تم تطوير نظام شامل للموافقة على العقارات الجديدة قبل ظهورها على الموقع الرئيسي. النظام يوفر:

- ✅ نظام موافقة متكامل مع دورة حياة كاملة للعقار
- 📧 إشعارات بريدية لـ Landlords عند الموافقة/الرفض
- 👨‍💼 لوحة Admin محسّنة لإدارة العقارات
- 📱 صفحات React متقدمة للـ Admin والـ Landlords
- 🔄 إمكانية إعادة إرسال العقارات المرفوضة

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

## 📊 حالات العقار

| الحالة | الكود | الوصف | من يراها |
|-------|------|-------|---------|
| مسودة | `draft` | عقار تحت الإنشاء (لم يُرسل بعد) | Landlord فقط |
| قيد المراجعة | `pending` | انتظار الموافقة من Admin | Landlord + Admin |
| موافق عليه | `approved` | عقار منشور على الموقع | الجميع |
| مرفوض | `rejected` | عقار تم رفضه | Landlord + Admin فقط |

---

## 🔧 المكونات الجديدة

### 1️⃣ Backend - Django

#### **models.py** - نموذج الموافقات
```python
class Property(models.Model):
    STATUS_CHOICES = [
        ('draft', 'مسودة'),
        ('pending', 'قيد المراجعة'),
        ('approved', 'موافق عليه'),
        ('rejected', 'مرفوض'),
    ]
    
    # حقول الموافقات
    owner = ForeignKey(UserProfile, related_name='properties')
    status = CharField(choices=STATUS_CHOICES, default='draft')
    submitted_at = DateTimeField(null=True, blank=True)
    approved_by = ForeignKey(UserProfile, related_name='approved_properties', null=True)
    approval_notes = TextField(blank=True)  # ملاحظات الموافقة/الرفض
```

#### **admin.py** - لوحة Django Admin محسّنة
```
✨ ميزات جديدة:
- عرض حالة العقار بألوان مميزة
- تصفية سهلة حسب الحالة
- أزرار سريعة للموافقة/الرفض
- اجراءات مجموعية (approve_properties, reject_properties)
```

#### **views.py** - API Endpoints جديدة
```python
GET  /listings/properties/pending/          # العقارات المعلقة (Admin)
GET  /listings/properties/rejected/         # العقارات المرفوضة (Admin)
GET  /listings/properties/rejected_by_me/   # عقاراتي المرفوضة (Landlord)
GET  /listings/properties/statistics/       # إحصائيات (Admin)

POST /listings/properties/{id}/approve/     # الموافقة (Admin)
POST /listings/properties/{id}/reject/      # الرفض (Admin)
POST /listings/properties/{id}/resubmit/    # إعادة الإرسال (Landlord)
```

#### **notifications.py** - نظام البريد الإلكتروني
```python
send_property_approved_email()   # ✅ بريد الموافقة
send_property_rejected_email()   # ❌ بريد الرفض
send_property_submitted_email()  # 📬 بريد الاستقبال
```

#### **قوالب البريد** (HTML جميلة)
```
/listings/templates/email/
  ├── property_approved.html     # تصميم احترافي للموافقة
  ├── property_rejected.html     # تصميم احترافي للرفض
  └── property_submitted.html    # تصميم احترافي للاستقبال
```

---

### 2️⃣ Frontend - React

#### **AdminApprovalPanel.tsx** ⭐ صفحة جديدة للـ Admin
```
✨ الميزات:
- عرض إحصائيات شاملة (total, pending, approved, rejected, draft)
- تصفية ضمن ثلاث علامات تبويب (pending, approved, rejected)
- عرض تفاصيل كل عقار عند الضغط عليه
- إمكانية إضافة ملاحظات قبل الموافقة/الرفض
- عرض الصور والوصف الكامل
- أزرار سريعة للموافقة/الرفض
```

**المسار:** `/dashboard/admin-approval`

#### **MyRejectedProperties.tsx** ⭐ صفحة جديدة للـ Landlord
```
✨ الميزات:
- عرض العقارات المرفوضة فقط
- عرض سبب الرفض بشكل واضح
- إمكانية إعادة الإرسال مباشرة من الصفحة
- نصائح مفيدة للـ Landlord
```

**المسار:** `/dashboard/my-rejected`

---

## 🔑 متغيرات البيئة المطلوبة

في ملف `.env`:

```env
# البريد الإلكتروني
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@eskan.com
SUPPORT_EMAIL=support@eskan.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### إعداد Gmail
1. فعّل 2-Step Verification على حسابك
2. اذهب إلى: https://myaccount.google.com/apppasswords
3. اختر "Mail" و "Windows Computer"
4. انسخ كلمة المرور واستخدمها في `EMAIL_HOST_PASSWORD`

---

## 📱 حركة المستخدم (User Flow)

### للـ Landlord:
```
1. يدخل لوحة التحكم (/dashboard)
2. يضيف عقار جديد (/dashboard/add-property)
3. ✉️ يستقبل بريد تأكيد الاستقبال
4. ينتظر الموافقة...
5. في حالة الموافقة:
   - ✅ يستقبل بريد الموافقة
   - العقار يظهر على الموقع
6. في حالة الرفض:
   - ❌ يستقبل بريد الرفض مع السبب
   - يذهب لصفحة العقارات المرفوضة (/dashboard/my-rejected)
   - يعدّل العقار ويعيد الإرسال
```

### للـ Admin:
```
1. يدخل لوحة الموافقة (/dashboard/admin-approval)
2. يرى الإحصائيات
3. يختار علامة تبويب "قيد المراجعة"
4. يراجع كل عقار بالتفاصيل الكاملة
5. يختار: موافقة ✅ أو رفض ❌
6. في حالة الموافقة:
   - يضيف ملاحظات اختيارية
   - يضغط "موافقة"
   - ✉️ يُرسل بريد للـ Landlord
7. في حالة الرفض:
   - يضيف سبب الرفض (إجباري)
   - يضغط "رفض"
   - ✉️ يُرسل بريد للـ Landlord مع السبب
```

---

## 🔒 الصلاحيات

| الإجراء | Landlord | Admin | Visitor |
|--------|----------|-------|---------|
| إضافة عقار | ✅ | ✅ | ❌ |
| رؤية عقاره | ✅ | ✅ | ❌ |
| تعديل عقاره قبل الموافقة | ✅ | ✅ | ❌ |
| تعديل عقار موافق عليه | ❌ | ✅ | ❌ |
| الموافقة على عقار | ❌ | ✅ | ❌ |
| رفض عقار | ❌ | ✅ | ❌ |
| إعادة إرسال عقار مرفوض | ✅ | ❌ | ❌ |
| رؤية العقارات الموافق عليها | ✅ | ✅ | ✅ |

---

## 🧪 كيفية الاختبار

### 1️⃣ اختبار Backend

```bash
# تشغيل الـ Django
cd backend
python manage.py runserver

# جعل نفسك admin
python manage.py createsuperuser

# الوصول للـ admin panel
http://localhost:8000/admin
```

### 2️⃣ اختبار Frontend

```bash
# تشغيل React
npm run dev
```

### 3️⃣ اختبار الـ API

```bash
# جلب العقارات المعلقة
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8000/api/listings/properties/pending/

# الموافقة على عقار
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"approval_notes":"عقار رائع"}' \
     http://localhost:8000/api/listings/properties/{property_id}/approve/

# رفض عقار
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"approval_notes":"الصور غير واضحة"}' \
     http://localhost:8000/api/listings/properties/{property_id}/reject/
```

### 4️⃣ اختبار البريد الإلكتروني

البريد سيكون محفوظ في Console (لأن `EMAIL_BACKEND` الافتراضي هو console)

---

## 📝 الملفات المعدّلة

```
✏️ Backend:
  ├── listings/models.py              (أضيفت حقول الموافقات)
  ├── listings/admin.py                (محسّن بالكامل)
  ├── listings/views.py                (أضيفت endpoints جديدة)
  ├── listings/serializers.py          (أضيفت حقول جديدة)
  ├── listings/notifications.py        (ملف جديد)
  ├── listings/templates/email/        (مجلد جديد بقوالب HTML)
  └── backend_project/settings.py      (إعدادات البريد)

📱 Frontend:
  ├── src/App.tsx                      (مسارات جديدة)
  ├── src/pages/dashboard/AdminApprovalPanel.tsx    (صفحة جديدة)
  └── src/pages/dashboard/MyRejectedProperties.tsx  (صفحة جديدة)
```

---

## ⚠️ نقاط مهمة

1. **البريد الإلكتروني**
   - يحتاج `EMAIL_HOST_USER` و `EMAIL_HOST_PASSWORD` للعمل فعلياً
   - بدون ذلك سيطبع البريد في Console فقط

2. **الصلاحيات**
   - تأكد أن مستخدم Admin لديه `is_staff=True`
   - استخدم `createsuperuser` لإنشاء admin

3. **الصور**
   - تأكد من أن الـ MEDIA_ROOT صحيح
   - الصور ستُعرض بشكل صحيح في بريد HTML

4. **الـ Frontend URL**
   - يجب تعيين `FRONTEND_URL` في `.env`
   - ستُستخدم في روابط البريد الإلكتروني

---

## 🚀 الخطوات التالية (مستقبلاً)

- [ ] إضافة نظام إشعارات في الموقع (Web Notifications)
- [ ] إضافة نظام SMS للإشعارات
- [ ] إضافة تقارير إحصائية للـ Admin
- [ ] إضافة أدوات تحليل للـ Landlord
- [ ] نظام تقييمات للعقارات

---

## 📞 الدعم

في حالة واجهت أي مشاكل:
1. تحقق من الـ logs في console
2. تأكد من إعدادات البريد الإلكتروني
3. راجع الـ API endpoints
4. تحقق من الصلاحيات

---

**تم التطوير بنجاح! 🎉**
