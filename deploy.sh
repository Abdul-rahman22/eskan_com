#!/bin/bash

# ========================================
# Eskan Project Deployment Script
# Django + React + PostgreSQL on DigitalOcean
# ========================================

set -e  # Exit on error

echo "🚀 Starting Eskan Deployment..."

# ========== Step 1: System Setup ==========
echo "📦 Step 1: Updating system packages..."
sudo apt update
sudo apt upgrade -y

# ========== Step 2: Install Docker ==========
echo "🐳 Step 2: Installing Docker and Docker Compose..."
sudo apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

echo "✅ Docker installed successfully"

# ========== Step 3: Clone Project ==========
echo "📁 Step 3: Cloning Eskan project..."
cd /var/www
sudo git clone https://github.com/Abdul-rahman22/eskan_com.git || (cd eskan_com && sudo git pull)
cd eskan_com
sudo chown -R $USER:$USER .

echo "✅ Project cloned successfully"

# ========== Step 4: Setup Environment ==========
echo "🔧 Step 4: Setting up environment variables..."

# Generate secure SECRET_KEY
SECRET_KEY=$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
POSTGRES_PASSWORD=$(openssl rand -base64 32)
DB_PASSWORD=$(openssl rand -base64 32)

# Create .env file
cat > .env << EOF
# Django Settings
DEBUG=False
SECRET_KEY=$SECRET_KEY
ALLOWED_HOSTS=localhost,127.0.0.1,eskan.com,www.eskan.com,YOUR_DROPLET_IP
TIME_ZONE=Africa/Cairo

# PostgreSQL Database
DATABASE_ENGINE=django.db.backends.postgresql
DATABASE_NAME=eskan_db
DATABASE_USER=eskan_user
DATABASE_PASSWORD=$DB_PASSWORD
DATABASE_HOST=db
DATABASE_PORT=5432

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,https://eskan.com,https://www.eskan.com
CORS_ALLOW_ALL_ORIGINS=False

# Security Settings
SECURE_SSL_REDIRECT=False
SESSION_COOKIE_SECURE=False
CSRF_COOKIE_SECURE=False

# Redis
REDIS_URL=redis://redis:6379/0
EOF

echo "✅ Environment file created"
echo "📝 Please update .env with your domain IP address"

# ========== Step 5: Build and Start Containers ==========
echo "🔨 Step 5: Building Docker images..."
sudo docker-compose build

echo "▶️  Step 6: Starting services..."
sudo docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 10

# ========== Step 6: Run Migrations ==========
echo "📊 Step 7: Running database migrations..."
sudo docker-compose exec -T app python manage.py migrate

echo "🎯 Step 8: Collecting static files..."
sudo docker-compose exec -T app python manage.py collectstatic --noinput

# ========== Step 7: Setup SSL ==========
echo "🔒 Step 9: Setting up SSL certificate with Let's Encrypt..."
sudo apt install -y certbot python3-certbot-nginx

echo "⚠️  Note: Configure Nginx first, then run:"
echo "sudo certbot --nginx -d eskan.com -d www.eskan.com"

# ========== Step 8: Verify Deployment ==========
echo "✅ Checking deployment status..."
sudo docker-compose ps

echo ""
echo "========================================"
echo "🎉 Deployment Complete!"
echo "========================================"
echo ""
echo "📍 Access your application:"
echo "   - Frontend: http://YOUR_DROPLET_IP"
echo "   - API: http://YOUR_DROPLET_IP:8000"
echo ""
echo "📝 Next Steps:"
echo "   1. Update .env with your actual domain and IP"
echo "   2. Configure DNS records"
echo "   3. Setup SSL certificate"
echo "   4. Configure custom domain in Nginx"
echo ""
echo "📊 Check logs:"
echo "   sudo docker-compose logs -f app"
echo ""
echo "🔄 Update application:"
echo "   cd /var/www/eskan_com && git pull && sudo docker-compose restart"
echo ""
echo "========================================"
