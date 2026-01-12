# دليل نشر مشروع Eskan على DigitalOcean
# Eskan Project Deployment Guide on DigitalOcean

## نظرة عامة | Project Overview

هذا المشروع يتكون من:
- **Frontend**: React + TypeScript + Vite (في المجلد الرئيسي)
- **Backend**: Django REST Framework (في مجلد backend)

This project consists of:
- **Frontend**: React + TypeScript + Vite (in root directory)
- **Backend**: Django REST Framework (in backend directory)

---

## المتطلبات | Prerequisites

1. DigitalOcean Account
2. Docker و Docker Compose (اختياري - يُفضل | optional - recommended)
3. Git
4. SSH key pair

---

## الخطوات الأولى | Initial Setup Steps

### 1. إنشاء Droplet على DigitalOcean | Create Droplet on DigitalOcean

- **OS**: Ubuntu 22.04 LTS (الموصى به)
- **Size**: 2GB RAM أو أكثر (للأداء الجيد)
- **Region**: اختر الأقرب لمستخدميك

### 2. الاتصال بـ Droplet | Connect to Droplet

```bash
ssh root@YOUR_DROPLET_IP
```

### 3. تثبيت المتطلبات الأساسية | Install Dependencies

```bash
# تحديث النظام
apt update && apt upgrade -y

# تثبيت Python و pip
apt install -y python3 python3-pip python3-venv

# تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# تثبيت Git
apt install -y git

# تثبيت Nginx (للـ reverse proxy)
apt install -y nginx

# تثبيت PostgreSQL (اختياري - للـ production)
apt install -y postgresql postgresql-contrib
```

### 4. استنساخ المشروع | Clone Project

```bash
cd /var/www
git clone https://github.com/Abdul-rahman22/eskan_com.git
cd eskan_com
```

---

## إعداد Backend (Django) | Backend Setup

### 1. إنشاء Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

### 2. تثبيت المتطلبات | Install Requirements

أولاً، تحقق من وجود requirements.txt:

```bash
pip install --upgrade pip
pip install django djangorestframework django-cors-headers
pip install gunicorn  # لـ production
pip install python-decouple  # لإدارة المتغيرات البيئية
```

أو إنشاء requirements.txt:

```bash
pip freeze > requirements.txt
```

### 3. إعداد متغيرات البيئة | Set Environment Variables

أنشئ ملف `.env` في مجلد backend:

```bash
cat > .env << EOF
DEBUG=False
SECRET_KEY=your-secure-secret-key-here-change-this
ALLOWED_HOSTS=your-domain.com,www.your-domain.com,YOUR_IP_ADDRESS
DATABASE_URL=sqlite:///db.sqlite3
EOF
```

**اجعل Secret Key قوياً:**
```bash
python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 4. تحديث Django Settings | Update Django Settings

عدّل `backend_project/settings.py`:

```python
import os
from decouple import config

DEBUG = config('DEBUG', default=False, cast=bool)
SECRET_KEY = config('SECRET_KEY')
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost', cast=lambda v: [s.strip() for s in v.split(',')])

# Database - للـ SQLite (يمكن تغييره لـ PostgreSQL في production)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# CORS - ركز على الدومين الصحيح في production
CORS_ALLOWED_ORIGINS = [
    "https://your-domain.com",
    "https://www.your-domain.com",
]

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

### 5. تشغيل Migrations | Run Migrations

```bash
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py collectstatic --noinput
```

### 6. اختبار Backend | Test Backend

```bash
python3 manage.py runserver 0.0.0.0:8000
```

تحقق من: `http://YOUR_IP:8000/`

---

## إعداد Frontend (React) | Frontend Setup

### 1. تثبيت المتطلبات | Install Dependencies

```bash
cd /var/www/eskan_com  # العودة للـ root
npm install
```

### 2. إعداد متغيرات البيئة | Set Environment Variables

أنشئ ملف `.env` في الـ root:

```bash
cat > .env << EOF
VITE_API_URL=http://localhost:8000
VITE_API_URL_PROD=https://api.your-domain.com
EOF
```

### 3. بناء المشروع | Build Project

```bash
npm run build
```

سيتم إنشاء مجلد `dist` يحتوي على الملفات النهائية.

---

## إعداد Nginx | Configure Nginx

أنشئ ملف تكوين جديد:

```bash
sudo nano /etc/nginx/sites-available/eskan
```

أضف المحتوى التالي:

```nginx
upstream django {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    client_max_body_size 100M;

    # Frontend (React)
    location / {
        root /var/www/eskan_com/dist;
        try_files $uri $uri/ /index.html;
    }

    # API Backend (Django)
    location /api/ {
        proxy_pass http://django;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files
    location /static/ {
        alias /var/www/eskan_com/backend/staticfiles/;
    }

    # Media files
    location /media/ {
        alias /var/www/eskan_com/backend/media/;
    }
}
```

تفعيل الموقع:

```bash
sudo ln -s /etc/nginx/sites-available/eskan /etc/nginx/sites-enabled/
sudo nginx -t  # اختبار التكوين
sudo systemctl restart nginx
```

---

## إعداد Gunicorn | Setup Gunicorn Service

أنشئ ملف خدمة:

```bash
sudo nano /etc/systemd/system/eskan-django.service
```

أضف:

```ini
[Unit]
Description=Eskan Django Application
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/eskan_com/backend
ExecStart=/var/www/eskan_com/backend/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:8000 backend_project.wsgi:application
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

تفعيل الخدمة:

```bash
sudo systemctl daemon-reload
sudo systemctl enable eskan-django.service
sudo systemctl start eskan-django.service
sudo systemctl status eskan-django.service
```

---

## إعداد SSL (Let's Encrypt) | Setup HTTPS

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

سيتم تحديث Nginx تلقائياً لاستخدام HTTPS.

---

## التحقق النهائي | Final Verification

✅ تحقق من أن الموقع يعمل:
- زر `https://your-domain.com`
- اختبر API endpoints مثل `/api/listings/`

✅ تحقق من السجلات:
```bash
sudo systemctl status eskan-django.service
sudo tail -f /var/log/nginx/access.log
```

---

## الصيانة والتحديثات | Maintenance

### تحديث الكود
```bash
cd /var/www/eskan_com
git pull origin main
cd backend
source venv/bin/activate
pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py collectstatic --noinput
sudo systemctl restart eskan-django.service

cd ..
npm install
npm run build
sudo systemctl restart nginx
```

### النسخ الاحتياطية | Backups
```bash
# النسخ الاحتياطية للقاعدة البيانات
cp /var/www/eskan_com/backend/db.sqlite3 /backup/db.sqlite3.backup

# الملفات المرفوعة
tar -czf /backup/media-$(date +%Y%m%d).tar.gz /var/www/eskan_com/backend/media/
```

---

## استكشاف الأخطاء | Troubleshooting

**المشكلة**: 502 Bad Gateway
- `sudo systemctl restart eskan-django.service`
- تحقق من السجلات: `journalctl -u eskan-django.service -n 50`

**المشكلة**: CORS errors
- تحقق من `CORS_ALLOWED_ORIGINS` في settings.py
- تأكد من مطابقة الدومين

**المشكلة**: الملفات الثابتة لا تظهر
- `python3 manage.py collectstatic --noinput`
- تحقق من مسارات في Nginx config

---

## الأمان | Security Notes

⚠️ **هام للـ Production:**
1. غيّر `SECRET_KEY` إلى قيمة قوية
2. اجعل `DEBUG=False`
3. استخدم قاعدة بيانات قوية (PostgreSQL)
4. استخدم HTTPS (Let's Encrypt)
5. اجعل `CORS_ALLOW_ALL_ORIGINS = False`
6. أضف `SECURE_SSL_REDIRECT = True`
7. استخدم firewalls و security groups

---

## الدعم | Support

إذا واجهت مشاكل:
1. اقرأ Django documentation: https://docs.djangoproject.com/
2. اقرأ React documentation: https://react.dev/
3. تحقق من السجلات (logs)
4. اسأل في المجتمعات البرمجية

---

**تم إنشاء هذا الدليل**: November 2025
**المشروع**: eskan_com
**الحالة**: جاهز للنشر
