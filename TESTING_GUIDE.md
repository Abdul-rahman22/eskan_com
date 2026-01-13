# 🧪 دليل الاختبار

## قبل البدء

```bash
# تأكد من تشغيل Backend و Frontend
cd backend
python manage.py runserver  # Port 8000

# في نافذة أخرى
npm run dev  # Port 3000/5173
```

---

## ✅ خطوات الاختبار الأساسي

### 1️⃣ إنشاء حسابات الاختبار

#### أ) إنشاء Admin User
```bash
python manage.py createsuperuser
# Username: admin
# Email: admin@test.com
# Password: admin123
```

#### ب) إنشاء Landlord User
```
ادخل إلى http://localhost:3000/register
- اسم المستخدم: landlord1
- البريد: landlord@test.com
- كلمة المرور: landlord123
- نوع المستخدم: Landlord
```

---

### 2️⃣ اختبار إضافة عقار

1. **سجل الدخول كـ Landlord**
   - اذهب إلى: `http://localhost:3000/dashboard`

2. **اضغط "إضافة عقار جديد"**
   - ملأ جميع الحقول
   - اضغط "إرسال"

3. **ستظهر رسالة نجاح** ✅

4. **تحقق من الحالة**
   - يجب أن تكون `status = "pending"`

5. **تحقق من البريد الإلكتروني**
   - في Console (إذا كنت تستخدم EmailBackend console)
   - سيظهر بريد تأكيد الاستقبال

---

### 3️⃣ اختبار الموافقة (كـ Admin)

#### كونسول Django
```bash
# عرض العقارات المعلقة
python manage.py shell
>>> from listings.models import Property
>>> Property.objects.filter(status='pending')
```

#### لوحة Admin Django
```
1. اذهب إلى http://localhost:8000/admin
2. ادخل بحساب Admin
3. اضغط على "Properties"
4. ستجد العقار الجديد
5. اضغط على العقار
6. غيّر الحالة من "مسودة" إلى "موافق عليه"
7. اضغط "حفظ"
8. ستجد رسالة نجاح
```

#### لوحة React Admin
```
1. اذهب إلى http://localhost:3000/dashboard/admin-approval
2. اختر علامة تبويب "قيد المراجعة"
3. ستجد العقار
4. اضغط عليه للتوسيع
5. أضف ملاحظات (اختياري)
6. اضغط زر "موافقة" الأخضر
7. ستظهر رسالة نجاح
```

---

### 4️⃣ اختبار البريد الإلكتروني

#### بريد الموافقة
```
يجب أن يصل إلى: landlord@test.com
الموضوع: ✅ تم الموافقة على عقارك
يحتوي على: اسم العقار، المنطقة، السعر
```

#### عرض البريد في Console
```
إذا كنت تستخدم EmailBackend console:
- شاهد output الـ Django server
- سيطبع البريد هناك
```

---

### 5️⃣ اختبار الرفض

#### من لوحة React Admin
```
1. اضغط على عقار آخر
2. اضغط "توسيع"
3. أضف سبب الرفض (إجباري)
4. اضغط زر "رفض" الأحمر
5. ستظهر رسالة نجاح
```

#### التحقق من النتيجة
```
1. سجّل الدخول كـ Landlord
2. اذهب إلى http://localhost:3000/dashboard/my-rejected
3. ستجد العقار المرفوض
4. سيظهر سبب الرفض
```

---

### 6️⃣ اختبار إعادة الإرسال

#### من صفحة العقارات المرفوضة
```
1. اذهب إلى http://localhost:3000/dashboard/my-rejected
2. اضغط على العقار المرفوض
3. لاحظ سبب الرفض
4. اضغط زر "إعادة الإرسال"
5. ستظهر رسالة نجاح
6. الحالة ستعود إلى "pending"
```

---

## 🔍 اختبارات متقدمة

### اختبار الإحصائيات
```
1. اذهب إلى http://localhost:3000/dashboard/admin-approval
2. شاهد البطاقات العلوية:
   - الإجمالي
   - قيد المراجعة
   - موافق عليه
   - مرفوض
   - مسودة
```

### اختبار التصفية
```
1. في لوحة الموافقة
2. اختر "موافق عليه"
3. يجب أن يعرض فقط العقارات الموافق عليها
4. اختر "مرفوض"
5. يجب أن يعرض فقط العقارات المرفوضة
```

### اختبار الصور
```
1. عند إضافة عقار، أضف صور
2. في لوحة الموافقة، افتح العقار
3. يجب أن تظهر الصور الأولى (3 صور)
4. تحقق من جودة الصور
```

---

## 📊 اختبار API مباشرة

### جلب العقارات المعلقة
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8000/api/listings/properties/pending/
```

### الموافقة على عقار
```bash
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"approval_notes":"عقار رائع"}' \
     http://localhost:8000/api/listings/properties/{property_id}/approve/
```

### الرفض
```bash
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"approval_notes":"الصور غير واضحة"}' \
     http://localhost:8000/api/listings/properties/{property_id}/reject/
```

### إعادة الإرسال
```bash
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8000/api/listings/properties/{property_id}/resubmit/
```

---

## ⚠️ معالجة الأخطاء

### إذا لم تظهر الإحصائيات
- تأكد من أنك Admin
- جرّب refresh الصفحة
- تحقق من console للأخطاء

### إذا لم يعمل الرفض
- تأكد من إدخال سبب الرفض (إجباري)
- شاهد console للأخطاء

### إذا لم يظهر البريد الإلكتروني
- تحقق من Email Backend في settings.py
- إذا كان console، شاهد Django server output
- إذا كان SMTP، تحقق من الـ credentials

---

## ✅ قائمة المراجعة النهائية

- [ ] تم تسجيل دخول Admin
- [ ] تم إنشاء Landlord
- [ ] تم إضافة عقار (status = pending)
- [ ] تم عرض العقار في لوحة الموافقة
- [ ] تم الموافقة على العقار
- [ ] تم استقبال البريد
- [ ] تم الرفض مع سبب
- [ ] تم رؤية سبب الرفض
- [ ] تم إعادة الإرسال
- [ ] العقار عاد إلى "pending"

---

## 🎉 إذا نجحت جميع الاختبارات

**النظام جاهز للإنتاج! 🚀**

تأكد من:
1. ✅ تعيين EMAIL credentials
2. ✅ تعيين FRONTEND_URL
3. ✅ تشغيل migrations
4. ✅ إنشاء superuser

---

**مرة أخرى: استمتع بالاختبار! 🧪**
