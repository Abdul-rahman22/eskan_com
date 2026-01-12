# خطوات نشر Eskan على DigitalOcean
# Eskan Deployment Steps on DigitalOcean

## المتطلبات | Prerequisites

✅ **قبل البدء تأكد من:**
- ✓ DigitalOcean account
- ✓ SSH key setup
- ✓ Ubuntu 22.04 LTS Droplet (2GB RAM أو أكثر)
- ✓ Domain name (eskan.com)

---

## الخطوة 1: الاتصال بـ Droplet

```bash
# Connect to your Droplet
ssh root@YOUR_DROPLET_IP

# Or if you have a specific SSH key
ssh -i /path/to/key root@YOUR_DROPLET_IP
```

---

## الخطوة 2: تحميل واستخدام Deploy Script

```bash
# Download the deployment script
cd /tmp
wget https://raw.githubusercontent.com/Abdul-rahman22/eskan_com/main/deploy.sh

# أو استخدم curl
curl -O https://raw.githubusercontent.com/Abdul-rahman22/eskan_com/main/deploy.sh

# اجعله قابل للتنفيذ
chmod +x deploy.sh

# قم بتشغيل Script
sudo bash deploy.sh
```

---

## الخطوة 3: تحديث .env بالقيم الصحيحة

بعد انتهاء Script، عدّل .env:

```bash
cd /var/www/eskan_com
sudo nano .env
```

**القيم المهمة:**
```env
ALLOWED_HOSTS=localhost,127.0.0.1,eskan.com,www.eskan.com,YOUR_DROPLET_IP
DATABASE_PASSWORD=your-secure-password  # استخدم الكلمة التي ظهرت
SECURE_SSL_REDIRECT=True  # بعد تفعيل SSL
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

---

## الخطوة 4: التحقق من أن كل شيء يعمل

```bash
# Check container status
sudo docker-compose ps

# Check logs
sudo docker-compose logs -f app

# Test the API
curl http://localhost:8000/api/

# Test frontend (might need to wait a minute)
curl http://localhost/
```

**يجب أن ترى:**
- ✅ 3 containers running: app, db, nginx
- ✅ Django API responding
- ✅ Frontend serving via Nginx

---

## الخطوة 5: تكوين Domain Name

### عند DigitalOcean (DNS):

1. اذهب إلى: https://cloud.digitalocean.com/networking/domains
2. أضف domain: `eskan.com`
3. أضف A record:
   - **Hostname**: `@` (للـ root)
   - **Type**: A
   - **Value**: YOUR_DROPLET_IP
4. أضف A record آخر:
   - **Hostname**: `www`
   - **Type**: A
   - **Value**: YOUR_DROPLET_IP

**انتظر 5-10 دقائق للـ DNS propagation**

---

## الخطوة 6: تفعيل SSL (HTTPS)

```bash
# SSH to your Droplet
ssh root@YOUR_DROPLET_IP

# تشغيل Certbot
sudo certbot --nginx -d eskan.com -d www.eskan.com

# اتبع الخطوات:
# - ادخل بريدك الإلكتروني
# - وافق على الشروط
# - اختر yes لـ redirect to HTTPS
```

**بعد ذلك:**
```bash
# تحديث .env
sudo nano .env

# تغيير هذه الأسطر:
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

```bash
# إعادة تشغيل containers
sudo docker-compose restart
```

---

## الخطوة 7: التحقق النهائي

```bash
# الوصول إلى موقعك
https://eskan.com

# التحقق من SSL
ssllabs.com/ssltest/analyze.html?d=eskan.com

# اختبار API
https://eskan.com/api/
```

**يجب أن تشاهد:**
- ✅ الموقع يعمل بـ HTTPS
- ✅ Green lock في المتصفح
- ✅ API endpoints تعمل
- ✅ React frontend يحمل بسرعة

---

## المراقبة والصيانة

### مراقبة السجلات

```bash
# شاهد سجلات التطبيق
sudo docker-compose logs -f app

# شاهد سجلات قاعدة البيانات
sudo docker-compose logs -f db

# شاهد سجلات nginx
sudo docker-compose logs -f nginx
```

### تحديث التطبيق

```bash
cd /var/www/eskan_com
sudo git pull origin main
sudo docker-compose up -d --build
sudo docker-compose exec app python manage.py migrate
```

### النسخ الاحتياطية

```bash
# نسخ احتياطية لقاعدة البيانات
sudo docker-compose exec -T db pg_dump -U eskan_user eskan_db > /backup/eskan_db_$(date +%Y%m%d).sql

# نسخ احتياطية للملفات المرفوعة
sudo tar -czf /backup/media_$(date +%Y%m%d).tar.gz /var/www/eskan_com/backend/media/
```

---

## استكشاف المشاكل

### المشكلة: Containers لا تعمل

```bash
# تحقق من الحالة
sudo docker-compose ps

# شاهد الأخطاء
sudo docker-compose logs app

# أعد التشغيل
sudo docker-compose restart
```

### المشكلة: SSL لا يعمل

```bash
# تحقق من Certbot
sudo certbot renew --dry-run

# إعادة تشغيل Nginx
sudo docker-compose restart nginx
```

### المشكلة: Database connection error

```bash
# تحقق من متغيرات البيئة
grep DATABASE .env

# أعد تشغيل database
sudo docker-compose restart db
```

---

## الأمان - نصائح مهمة

⚠️ **تأكد من:**
1. ✅ DEBUG=False في .env
2. ✅ SECRET_KEY عشوائي وقوي
3. ✅ ALLOWED_HOSTS محدد صحيح
4. ✅ قاعدة البيانات محمية بكلمة مرور قوية
5. ✅ HTTPS مفعل
6. ✅ Firewall نشط

---

## عنوان موقعك الجديد

🎉 **تهانينا! موقعك الآن على:**

- **Frontend**: https://eskan.com
- **API**: https://eskan.com/api/
- **Admin**: https://eskan.com/admin/

---

**تم النشر بنجاح! 🚀**
