@echo off
title Sakn Egypt Project Runner

echo ==========================================
echo 🔹 بدء تشغيل مشروع سكن مصر...
echo ==========================================

REM -----------------------------
REM تشغيل Backend (Django)
REM -----------------------------
echo 🟢 تشغيل Django Backend...
cd D:\proj\eskan\backend
call .venv\Scripts\activate
start cmd /k "python manage.py runserver"

REM -----------------------------
REM تشغيل Frontend (React)
REM -----------------------------
echo 🟢 تشغيل React Frontend...
cd D:\proj\eskan\frontend
start cmd /k "npm run dev"

echo ==========================================
echo ✅ تم تشغيل السيرفرين بنجاح!
echo - Django على http://127.0.0.1:8000
echo - React على http://localhost:5173
echo ==========================================

pause
