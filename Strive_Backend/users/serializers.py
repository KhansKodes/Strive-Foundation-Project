# users/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    # We’ll accept multiple alias keys and normalize in validate()
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=False)  # alias for confirm
    confirm_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = (
            "phone",
            "full_name",
            #"last_name",
            "role",
            "password",
            "password2",
            "confirm_password",
        )

    def to_internal_value(self, data):
        """
        Map incoming spaced keys to model fields so your frontend can send:
        {
          "Full name": "...",
          "conform password": "..."
        }
        """
        # clone dict so we don't mutate original
        d = dict(data)

        # normalize spaced keys
        if "Full name" in d:
            d["full_name"] = d.pop("Full name")
        #if "Last name" in d:
        #    d["last_name"] = d.pop("Last name")
        # handle misspelling/variant
        if "conform password" in d and "confirm_password" not in d:
            d["confirm_password"] = d.pop("conform password")

        return super().to_internal_value(d)

    def validate(self, attrs):
        pwd = attrs.get("password")
        # allow either 'password2' or 'confirm_password'
        pwd2 = attrs.pop("password2", None) or attrs.pop("confirm_password", None)
        if pwd != pwd2:
            raise serializers.ValidationError({"password": "Passwords must match."})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "phone", "first_name", "last_name", "role")


class PhoneTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Uses AUTH_USER_MODEL.USERNAME_FIELD (we set to 'phone'), so
    login payload is: {"phone": "...", "password": "..."}
    """
    pass