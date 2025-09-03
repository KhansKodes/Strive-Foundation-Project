from functools import partial
import os
from pathlib import Path
from decouple import config
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Detect optional admin theme (Jazzmin) availability to avoid import errors
try:
    import jazzmin  # noqa: F401
    HAS_JAZZMIN = True
except Exception:
    HAS_JAZZMIN = False


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY')

DEBUG = os.getenv("DJANGO_DEBUG", "True") == "True" 
ALLOWED_HOSTS = os.getenv("DJANGO_ALLOWED_HOSTS", "127.0.0.1,localhost").split(",")

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
    'media_center',
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


LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files 
STATIC_URL = 'static/'
STATICFILES_DIRS = [
    BASE_DIR / "static",
]
STATIC_ROOT = BASE_DIR / "staticfiles"

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


JAZZMIN_SETTINGS = {
    "site_title": "Strive Admin",
    "site_header": "Strive Foundation",
    "site_brand": "Strive Admin",
    "welcome_sign": "Welcome to Strive Admin",
    "copyright": "Strive Foundation",
    
    # UI Customizations
    "show_ui_builder": True,
    "changeform_format": "horizontal_tabs",
    "related_modal_active": True,
    "custom_css": None,
    "custom_js": None,
    "show_sidebar": True,
    "navigation_expanded": True,
    
    # Theme settings
    "dark_mode_theme": "darkly",
    "brand_colour": "navbar-primary",
    "accent": "accent-primary",
    "brand_colour": "navbar-success",
    "accent": "accent-success",
    "navbar": "navbar-success navbar-dark",
    
    # UI Tweaks
    "button_classes": {
        "primary": "btn-primary",
        "secondary": "btn-secondary",
        "info": "btn-info",
        "warning": "btn-warning",
        "danger": "btn-danger",
        "success": "btn-success"
    },
    
    "actions_sticky_top": True,
    "use_google_fonts_cdn": True,
    "show_ui_builder": True,
    
    # Custom Links
    "custom_links": {
        "core": [{
            "name": "Analytics Dashboard", 
            "url": "admin:index", 
            "icon": "fas fa-chart-line",
            "permissions": ["core.view_analytics"]
        }]
    },

    # Left-side grouped menu (models are referenced as "app_label.modelname_lower")
    "side_menu": [
        { "label": "Urgent Need", "models": [
            "core.urgentneed",
        ]},
        { "label": "Impact", "models": [
            "core.impactstats", "core.impacttextbox",
        ]},
        { "label": "Legacy & Events", "models": [
            "core.iprcitem", "core.event", "core.eventdetail", "core.eventimage",
        ]},
        { "label": "Content", "models": [
            "core.slide", "core.strapline", "core.getinvolved", "core.spotlight",
            "core.spotlightitem", "core.impactmakers", "core.impactitem",
            # If you have a MediaItem model and want it here:
            # "core.mediaitem",
        ]},
        { "label": "Contact", "models": [
            "core.contactmessage",
        ]},
        { "label": "Media Center", "models": [
            "media_center.mediapost",
        ]},
        { "app": "auth", "label": "Authentication & Authorization" },  # Users/Groups
    ],

    # (Optional) nice icons
    "icons": {
        "core.urgentneed": "fas fa-exclamation-circle",
        "core.impactstats": "fas fa-chart-line",
        "core.impacttextbox": "fas fa-align-left",
        "core.iprcitem": "fas fa-list",
        "core.event": "fas fa-bullhorn",
        "core.eventdetail": "fas fa-file-alt",
        "core.eventimage": "fas fa-image",
        "core.slide": "fas fa-images",
        "core.strapline": "fas fa-heading",
        "core.getinvolved": "fas fa-hands-helping",
        "core.spotlight": "fas fa-star",
        "core.spotlightitem": "fas fa-star-half-alt",
        "core.impactmakers": "fas fa-users",
        "core.impactitem": "fas fa-user-friends",
        "core.contactmessage": "fas fa-envelope",
        "auth.user": "fas fa-user",
        "auth.group": "fas fa-user-shield",
        "media_center.mediapost": "fas fa-bullhorn",
    },
}

JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": False,
    "footer_small_text": False,
    "body_small_text": False,
    "brand_small_text": False,
    "brand_colour": False,
    "accent": "accent-primary",
    "navbar": "navbar-dark",
    "no_navbar_border": True,
    "navbar_fixed": True,
    "layout_boxed": False,
    "footer_fixed": False,
    "sidebar_fixed": True,
    "sidebar": "sidebar-dark-primary",
    "sidebar_nav_small_text": False,
    "sidebar_disable_expand": False,
    "sidebar_nav_child_indent": True,
    "sidebar_nav_compact_style": True,
    "sidebar_nav_legacy_style": False,
    "sidebar_nav_flat_style": True,
    #"theme": "darkly",
    #"dark_mode_theme": "darkly",
    "button_classes": {
        "primary": "btn-primary btn-lg",
        "secondary": "btn-secondary btn-lg",
        "info": "btn-info btn-lg",
        "warning": "btn-warning btn-lg",
        "danger": "btn-danger btn-lg",
        "success": "btn-success btn-lg"
    },
    "actions_sticky_top": True
}

# Custom CSS for modern look
JAZZMIN_SETTINGS["custom_css"] = "css/custom.css"

JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": False,
    "footer_small_text": False,
    "body_small_text": True,
    "brand_small_text": False,
    "brand_colour": "navbar-primary",
    "accent": "accent-primary",
    "navbar": "navbar-primary navbar-dark",
    "no_navbar_border": True,
    "navbar_fixed": True,
    "layout_boxed": False,
    "footer_fixed": False,
    "sidebar_fixed": True,
    "sidebar": "sidebar-dark-primary",
    "sidebar_nav_small_text": False,
    "sidebar_disable_expand": False,
    "sidebar_nav_child_indent": False,
    "sidebar_nav_compact_style": False,
    "sidebar_nav_legacy_style": False,
    "sidebar_nav_flat_style": True,
    "theme": "default",
    "dark_mode_theme": None,
    "button_classes": {
        "primary": "btn-primary",
        "secondary": "btn-secondary btn-lg",
        "info": "btn-info btn-lg",
        "warning": "btn-warning btn-lg",
        "danger": "btn-danger btn-lg",
        "success": "btn-success btn-lg"
    },
    "actions_sticky_top": True
}