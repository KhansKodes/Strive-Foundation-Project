# users/models.py
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.core.validators import RegexValidator

# Role choices for the user
ROLE_CHOICES = (
    ('patient', 'Patient'),
    ('donor', 'Donor'),
    ('volunteer', 'Volunteer'),
    ('admin', 'Admin'),
)

phone_validator = RegexValidator(
    regex=r'^\+?\d{11,15}$',
    message="Enter a valid phone number )."
)

class UserManager(BaseUserManager):
    def create_user(self, phone, password=None, **extra_fields):
        if not phone:
            raise ValueError("Phone number is required")
        user = self.model(phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", "admin")
        if not extra_fields.get("is_staff"):
            raise ValueError("Superuser must have is_staff=True.")
        if not extra_fields.get("is_superuser"):
            raise ValueError("Superuser must have is_superuser=True.")
        return self.create_user(phone, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    # Django keeps an integer id as PK automatically
    phone = models.CharField(max_length=20, unique=True, validators=[phone_validator])
    full_name = models.CharField(max_length=150)
    #last_name = models.CharField(max_length=150, blank=True)  # optional
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    # Django admin / auth flags
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # Login field
    USERNAME_FIELD = "phone"
    REQUIRED_FIELDS = []  # we’ll collect first_name/role in serializer

    objects = UserManager()

    def __str__(self):
        return f"{self.phone} ({self.role})"
