from pathlib import Path #for handling file paths
from datetime import timedelta #for specifying lifespan of tokens
from dotenv import load_dotenv #to load enironment variables from a .env file
import os #for interacting with the operating system
import environ #for handling environment variables
from celery.schedules import crontab #for scheduling of celery tasks

load_dotenv() #load environment variables from .env-backend

env = environ.Env() #initlaise the environment varialbe handler

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

env.read_env(os.path.join(BASE_DIR, '.env-backend')) #read environment variables from .env-backend file in the BASE-DIR directory

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY') #CHECK READ ME TO ADD YOUR OWN

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"] #ALLOW ALL HOSTS FOR DEVELOPMENT

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication", #USE JAVASCRIPT WEB TOKEN FOR USER AUTHENTICATION
    ),
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated", #ONLY AUTHENTICATED USERS CAN ACCESS APIs
    ],
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30), #ACCESS TOKEN LIFETIME IS 30 MINS
    "REFRESH_TOKEN_LIFETIME": timedelta(hours=2), #REFRESH TOKEN LIFETIME IS 2 HOURS
    "ROTATE_REFRESH_TOKENS": True, #ALLOW FOR A NEW REFRESH TOKEN ON EACH REQUEST
    "BLACKLIST_AFTER_ROTATION": True, #BLACKLIST OLD REFRESH TOKENS FOR SECURITY
}

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'api', #THE API APP WE HAVE MADE WITHIN THE GREATER BACKEND DIRECTORY
    'corsheaders' #ALLOW CROSS ORIGIN RESOURCE SHARING
]

AUTH_USER_MODEL = 'api.CustomUser' #CUSTOM USER SHOULD BE USED INSTEAD OF DJANGO'S DEFAULT USER MODEL

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls' #ROOT URL CONFIGURATION

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

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
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

#CORS settings to allow all origins to access the API
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

#Medial file settings
MEDIA_URL = '/media/' #URL for accessing media files
MEDIA_ROOT = os.path.join(BASE_DIR, 'media') #Directory for storing uploaded media files


# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend' #use simple mail transfer protol backend for sending emails
EMAIL_HOST = 'smtp.gmail.com' #email host is the gmail smtp server
EMAIL_PORT = '587' #port for secure email sending
EMAIL_USE_TLS = True #enaable TLS for security
EMAIL_HOST_USER = env('EMAIL_HOST_USER') ##ADD YOUR OWN .env-backend -- CHECK READ ME FOR HELP
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD') ##ADD YOUR OWN .env-backend -- CHECK READ ME FOR HELP
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER #the defualt from email is the host user (YOU, READING THIS RIGHT NOW)

#Celery Configuration
CELERY_BROKER_URL = "redis://localhost:6379/0" ## CHANGE IF YOUR PORT IS DIFFERENT (CHECK THE REDIS-SERVER.EXE)
CELERY_RESULT_BACKEND = "redis://localhost:6379/0" ## CHANGE IF YOUR PORT IS DIFFERENT (CHECK THE REDIS-SERVER.EXE)
CELERY_BEAT_SCHEDULE = { ## RUNS NOTIFICATION TASK EVERY DAY AT 8AM
    'send_scheduled_notifications' : {
        'task' : 'api.tasks.send_scheduled_notifications', #define the task that needs to be ran
        'schedule': crontab(minute=0, hour=8) #everyday at 8am
    }
}
CELERY_ACCEPT_CONTENT = ["json"] #allow json content for tasks
CELERY_TASK_SERIALIZER = "json" #serialize tasks as json