# backend/Dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# OS deps (build tools + Postgres client libs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev gettext \
 && rm -rf /var/lib/apt/lists/*

# Requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# App code
COPY . .

# Create non-root user
RUN adduser --disabled-password --gecos "" appuser && chown -R appuser:appuser /app
USER appuser

# Default command (we will override in dev via docker compose)
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
