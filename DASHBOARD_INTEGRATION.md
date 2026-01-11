# نظام لوحة التحكم - وثائق التكامل

## نظرة عامة
تم إنشاء نظام لوحة تحكم شامل متكامل مع نظام تسجيل الدخول الموجود. المستخدم يقوم بتسجيل الدخول ثم يتم توجيهه إلى لوحة التحكم.

## البنية المعمارية

### المسارات الرئيسية (Routes)

```
App.tsx
├── /dashboard (محمي بـ ProtectedRoute)
│   └── يستدعي مكون Dashboard
│       ├── /dashboard (الصفحة الرئيسية - DashboardHome)
│       ├── /dashboard/add-property (إضافة عقار)
│       ├── /dashboard/my-properties (عقاراتي)
│       ├── /dashboard/favorites (المفضلة)
│       └── /dashboard/settings (الإعدادات)
├── /login (صفحة تسجيل الدخول)
├── /register (صفحة التسجيل)
└── ...(صفحات أخرى)
```

## الملفات والمكونات

### 1. src/pages/Dashboard.tsx (الملف الرئيسي الجديد)
**الدور**: نقطة الدخول للوحة التحكم، يحتوي على تعريف جميع المسارات الفرعية

**المسؤوليات**:
- استيراد جميع مكونات لوحة التحكم الفرعية
- تعريف المسارات الفرعية باستخدام React Router
- توجيه الطلبات إلى المكون المناسب

**المحتوى**:
```typescript
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardHome from './dashboard/DashboardHome';
import AddProperty from './dashboard/AddProperty';
import MyProperties from './dashboard/MyProperties';
import Favorites from './dashboard/Favorites';
import Settings from './dashboard/Settings';

const Dashboard: React.FC = () => {
  return (
    <Routes>
      <Route index element={<DashboardHome />} />
      <Route path="add-property" element={<AddProperty />} />
      <Route path="my-properties" element={<MyProperties />} />
      <Route path="favorites" element={<Favorites />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
};

export default Dashboard;
```

### 2. src/components/DashboardLayout.tsx
**الدور**: تخطيط اللوحة - يوفر الشريط الجانبي والرأس ومنطقة المحتوى

**المميزات**:
- شريط جانبي للملاحة (سطح المكتب والجوال)
- عرض معلومات المستخدم
- قائمة ملاحة ديناميكية
- زر تسجيل الخروج
- تحقق من المصادقة (Auth Check)
- دعم RTL للعربية

**المسارات المتاحة في القائمة**:
1. لوحة التحكم - /dashboard
2. إضافة عقار - /dashboard/add-property
3. عقاراتي - /dashboard/my-properties
4. المفضلة - /dashboard/favorites
5. الإعدادات - /dashboard/settings

### 3. src/pages/dashboard/DashboardHome.tsx
**الدور**: الصفحة الرئيسية للوحة التحكم

**المحتوى والمميزات**:
- إحصائيات العقارات (إجمالي، قيد المراجعة، موافق عليه، مرفوض)
- عرض عدد المشاهدات الإجمالية
- قائمة آخر العقارات المضافة
- زر سريع لإضافة عقار جديد
- تصميم متجاوب يعمل على جميع الأجهزة

### 4. src/pages/dashboard/AddProperty.tsx
**الدور**: صفحة إضافة عقار جديد

**المميزات**:
- نموذج شامل لإضافة العقارات
- تحميل الصور
- تحميل الفيديو
- حقول متعددة (السعر، الموقع، الوصف، إلخ)
- التحقق من البيانات (Validation)

### 5. src/pages/dashboard/MyProperties.tsx
**الدور**: عرض جميع عقارات المستخدم

**المميزات**:
- قائمة بجميع العقارات
- عرض حالة كل عقار (موافق عليه، قيد المراجعة، مرفوض)
- إمكانية حذف العقارات
- عرض الملاحظات الإدارية (إن وجدت)
- فلترة وفرز

### 6. src/pages/dashboard/Favorites.tsx
**الدور**: عرض العقارات المحفوظة/المفضلة

**المميزات**:
- عرض العقارات المحفوظة من قبل المستخدم
- إمكانية إزالة من المفضلة
- تصميم متطابق مع الصفحات الأخرى

### 7. src/pages/dashboard/Settings.tsx
**الدور**: إعدادات حساب المستخدم

**المميزات**:
- تعديل بيانات الملف الشخصي
- تحديث الاسم الكامل
- عرض بيانات المستخدم

## آلية التدفق

### عملية دخول المستخدم:
1. المستخدم يذهب إلى صفحة /login
2. يقوم بإدخال بيانات الدخول
3. عند النجاح، يتم حفظ التوكن في localStorage
4. يتم توجيهه إلى /dashboard
5. ProtectedRoute في App.tsx يتحقق من وجود auth_token
6. إذا كان موجوداً، يتم عرض لوحة التحكم
7. DashboardLayout يتم تحميله ويعرض القائمة الجانبية
8. Dashboard يقوم بتوجيه الطلبات إلى المكونات الصحيحة

## المكونات الداعمة

### ProtectedRoute.tsx
**الدور**: حماية المسارات التي تتطلب تسجيل دخول

**الوظيفة**:
- التحقق من وجود auth_token في localStorage
- إذا لم يكن موجوداً، توجيه المستخدم إلى /login
- وإلا، عرض المكون المطلوب

## قاعدة البيانات

التطبيق يستخدم Supabase مع الجداول التالية:

1. **auth** - للمصادقة (Supabase Built-in)
2. **profiles** - بيانات الملف الشخصي
   - user_id
   - full_name
   - avatar_url
   - وغيرها

3. **user_properties** - عقارات المستخدم
   - id
   - user_id
   - title
   - location
   - price
   - status (approved, pending, rejected)
   - images
   - views_count
   - admin_notes
   - وغيرها

4. **favorites** - العقارات المفضلة
   - user_id
   - property_id

## معالجة الأخطاء

- يتم عرض رسائل خطأ واضحة للمستخدم
- استخدام مكتبة "sonner" لعرض إشعارات النجاح والخطأ
- التحقق من البيانات قبل الإرسال

## التوافقية

- يعمل على جميع الأجهزة (سطح المكتب والجوال والتابلت)
- يدعم اللغة العربية والإنجليزية
- تصميم RTL للعربية

## الخطوات التالية

1. اختبار كامل النظام
2. إضافة ميزات إضافية حسب الحاجة
3. تحسين الأداء والـ SEO
4. إضافة المزيد من الإحصائيات والتقارير
