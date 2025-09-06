# Use slim Python image
FROM python:3.13-slim

# Make Python friendlier in containers
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Work inside /app
WORKDIR /app

# OS packages required for building psycopg2 and translations
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev gettext \
 && rm -rf /var/lib/apt/lists/*

# Install Python deps first (better caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project code
COPY . .

# Create non-root user for safety
RUN adduser --disabled-password --gecos "" appuser && chown -R appuser:appuser /app
USER appuser

# Default command for production; in dev compose we override with runserver
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
