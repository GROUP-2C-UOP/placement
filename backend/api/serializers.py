from rest_framework import serializers
from .models import Placement, CustomUser, Notifications
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import time


class UserSerializers(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "email", "password", "first_name", "last_name"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        first_name = validated_data.pop("first_name", "")
        last_name = validated_data.pop("last_name", "")
        email = validated_data.pop("email")

        validated_data['username'] = email

        user = CustomUser.objects.create_user(email=email, first_name=first_name, last_name=last_name, **validated_data)
        user.first_name = first_name
        user.last_name = last_name

        return user
    
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
                  "shown",
                  "read",
                  "user"]
        extra_kwargs = {"user": {"read_only": True}}
        

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

