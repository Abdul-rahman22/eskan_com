# بدء سريع | Quick Start Guide

هذا الدليل يساعدك على نشر مشروع Eskan بسرعة.
This guide helps you deploy Eskan project quickly.

---

## الخيارات | Deployment Options

### الخيار 1: Docker (موصى | Recommended)

**الخطوات:**

1. **تثبيت Docker و Docker Compose**
   ```bash
   sudo apt-get update
   sudo apt-get install docker.io docker-compose -y
   ```

2. **استنساخ المشروع**
   ```bash
   git clone https://github.com/Abdul-rahman22/eskan_com.git
   cd eskan_com
   ```

3. **إعداد .env**
   ```bash
   cp .env.example .env
   nano .env  # عدّل القيم
   ```

4. **تشغيل التطبيق**
   ```bash
   docker-compose up -d
   ```

5. **الاختبار**
   - API: http://localhost:8000
   - Frontend: http://localhost

---

## الملفات المهمة | Important Files

- `DEPLOYMENT_GUIDE.md` - دليل النشر الكامل
- `docker-compose.yml` - إعداد Docker Compose
- `Dockerfile` - إعداد Docker
- `.env.example` - مثال متغيرات البيئة
- `backend/requirements.txt` - متطلبات Python

---

## الخطوات التالية | Next Steps

1. اقرأ `DEPLOYMENT_GUIDE.md` للتفاصيل
2. اضبط SSL مع Let's Encrypt
3. أنشئ Database قوية (PostgreSQL)
4. ضع Backups متياطة
5. راقب الأمان

---

**مبروك**: الآن مشروعك جاهز للنشر!
Congratulations! Your project is ready for deployment!
