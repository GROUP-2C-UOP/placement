from rest_framework import serializers
from .models import Placement, CustomUser, Notifications, UserPreferences
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import time


class UserSerializers(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False) #dont make prof pic required on creation of user
    class Meta:
        model = CustomUser
        fields = ["id", "email", "password", "first_name", "last_name", "profile_picture"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        email = validated_data.pop("email")  # extract email to set as username
        validated_data["username"] = email  

        return CustomUser.objects.create_user(email=email, **validated_data)

class PlacementSerializers(serializers.ModelSerializer):
    class Meta:
        model = Placement
        fields = ["id", 
                  "company", 
                  "role", 
                  "salary", 
                  "starting_date", 
                  "duration",
                   "next_stage_deadline",
                   "placement_link",
                   "status",
                   "cv",
                   "cover_letter",
                   "contact",
                   "date_applied",
                   "description",
                  "user"]
        extra_kwargs = {"user": {"read_only": True}}


class NotificationSerializers(serializers.ModelSerializer):
    class Meta:
        model = Notifications
        fields = ["id",
                  "company",
                  "role",
                  "days",
                  "status",
                  "description",
                  "shown",
                  "read",
                  "created",
                  "placement",
                  "user"]
        extra_kwargs = {"user": {"read_only": True}}
        

class UserPreferencesSerializers(serializers.ModelSerializer):
    class Meta:
        model = UserPreferences
        fields = ["notification_enabled", "notification_time"]

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        remember_me = self.context['request'].data.get('remember_me', False)

        refresh_token = RefreshToken.for_user(self.user)
        if remember_me:
            refresh_token.set_exp(lifetime=timedelta(weeks=2)) 
        else:
            refresh_token.set_exp(lifetime=timedelta(hours=2)) 
        
        data['access'] = str(refresh_token.access_token)
        data['refresh'] = str(refresh_token)

        return data

