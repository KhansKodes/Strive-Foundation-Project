from functools import partial
import os
from pathlib import Path
from decouple import config
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY')

MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

# SECURITY WARNING: don't run with debug turned on in production!

DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'users',
    'patients',
    'donors',
    'volunteers',
    'core',
    'corsheaders',
    'sma_endgame',
    'partners',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT'),
    }
}

# Frontend dev URLs (adjust if you use a different port)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://khanskodes.github.io"
]
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 100,
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
}

AUTH_USER_MODEL = 'users.User'


STATIC_URL = '/static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'
STATICFILES_DIRS = [
    BASE_DIR / "static",
]
STATIC_ROOT = BASE_DIR / "staticfiles"

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

JAZZMIN_SETTINGS = {
    "site_title": "Strive Admin",
    "site_header": "Strive Foundation",
    "site_brand": "Strive Admin",
    "welcome_sign": "Welcome to Strive Admin",
    "copyright": "Strive Foundation",
    "show_ui_builder": False,
    "order_with_respect_to": [],

    # Left sidebar menu — group models into clean sections
    "side_menu": [
        {"app": "users", "label": "Users & Auth", "models": [
            "users.user", "users.profile",
        ]},
        {"label": "Patients", "models": [
            "patients.patient", "patients.appointment", "patients.treatmentrecord",
        ]},
        {"label": "Donations", "models": [
            "donors.donor", "donors.donation", "donors.campaign",
        ]},
        {"label": "Volunteers", "models": [
            "volunteers.volunteer", "volunteers.activity", "volunteers.task",
        ]},
        {"label": "Core Content", "models": [
            "core.mediaitem", "core.legacyitem", "core.contactmessage",
            "core.urgentneed", "core.impactstats", "core.impacttextbox",
            "core.strapline", "core.slide", "core.getinvolved", "core.contactmessage",
        ]},
        {"label": "Legacy & Events", "models": [
            "core.iprcitem", "core.event", "core.eventdetail", "core.eventimage",
        ]},
    ],

    # Icons (nice to have)
    "icons": {
        "users.user": "fas fa-user",
        "users.profile": "fas fa-id-badge",
        "patients.patient": "fas fa-user-injured",
        "patients.appointment": "fas fa-calendar-check",
        "donors.donation": "fas fa-hand-holding-heart",
        "donors.donor": "fas fa-user-friends",
        "volunteers.volunteer": "fas fa-hands-helping",
        "core.mediaitem": "fas fa-photo-video",
        "core.urgentneed": "fas fa-exclamation-circle",
        "core.impactstats": "fas fa-chart-line",
        "core.strapline": "fas fa-heading",
        "core.slide": "fas fa-images",
        "core.event": "fas fa-bullhorn",
        "core.eventimage": "fas fa-image",
        "core.getinvolved": "fas fa-bullseye",
        "core.contactmessage": "fas fa-envelope",
    },
}
