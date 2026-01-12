# Multi-stage build for Eskan Project
# Stage 1: Build Frontend (React)
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Build Backend (Django)
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir gunicorn

# Copy backend code
COPY backend/ .

# Copy frontend build from stage 1
COPY --from=frontend-builder /app/dist ./staticfiles/frontend

# Create necessary directories
RUN mkdir -p /app/media /app/logs

# Collect static files
RUN python manage.py collectstatic --noinput || true

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health', timeout=5)"

# Run gunicorn
CMD ["gunicorn", "--workers", "3", "--bind", "0.0.0.0:8000", "--access-logfile", "-", "--error-logfile", "-", "backend_project.wsgi:application"]
