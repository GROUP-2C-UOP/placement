from rest_framework import serializers 
from .models import Placement, ToDo, CustomUser, Notifications, UserPreferences #import the models 
from rest_framework_simplejwt.tokens import RefreshToken #import the refresh token from django itself
from datetime import timedelta 
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer #import django's inbuilt serializer for refresh and access tokens

class UserSerializers(serializers.ModelSerializer): #serializer for user model
    profile_picture = serializers.ImageField(required=False) #dont make prof pic required on creation of user
    class Meta: #defines how the data from the model should be converted
        model = CustomUser #specify this serializer is for customuser
        fields = ["id", "email", "password", "first_name", "last_name", "profile_picture"] #fields to include in serialization
        extra_kwargs = {"password": {"write_only": True}} #extra keyword argument for password is that it is write only and cannot be read, enforced for security

    def create(self, validated_data):
        email = validated_data.pop("email")  # extract email to set as username
        validated_data["username"] = email  #set email as username

        return CustomUser.objects.create_user(email=email, **validated_data) #create and return new user

class PlacementSerializers(serializers.ModelSerializer): #serializer for placement
    class Meta:
        model = Placement #specify this serializer is for placements
        fields = ["id",         #fields to be serialized
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
        extra_kwargs = {"user": {"read_only": True}} #make the user field read only so it cannot be modified directly by the API for security


class ToDoSerializers(serializers.ModelSerializer): #serializer for todo
    class Meta:
        model = ToDo #specify this serializer is for todos
        fields = ["id",         #fields to be serialized
                  "company", 
                  "role", 
                  "salary", 
                  "starting_date", 
                  "duration",
                   "next_stage_deadline",
                   "placement_link",
                   "description",
                  "user"]
        extra_kwargs = {"user": {"read_only": True}} #make the user field read only so it cannot be modified directly by the API for security


class NotificationSerializers(serializers.ModelSerializer): #serializer for notifications
    class Meta:
        model = Notifications #specify this serializer is for notifications
        fields = ["id",         #fields to be serialized
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
        extra_kwargs = {"user": {"read_only": True}} #make the user field read only so it cannot be modified directly by the API for security
        

class UserPreferencesSerializers(serializers.ModelSerializer): #serializer for user preferences
    class Meta:
        model = UserPreferences #specify this serializer for user preferences
        fields = ["notification_enabled", "email_notification_enabled", "notification_time"] #fields to be serialized

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer): #custom token obtain pair serializer which inherits django's token obtain pair serializer
    def validate(self, attrs): #validate function that has parameters self and attrs where attrs is the data being passed to the serializer 
        data = super().validate(attrs) #call parent class validate method to handle standard validation

        remember_me = self.context['request'].data.get('remember_me', False) #get remember_me's boolean value from the data, defaults to false if not there

        refresh_token = RefreshToken.for_user(self.user) #create a refresh token for user
        if remember_me: #if remember_me was checked off on log in
            refresh_token.set_exp(lifetime=timedelta(weeks=2))  #refresh token's lifetime is 2 weeks
        else:
            refresh_token.set_exp(lifetime=timedelta(hours=2))  #otherwise it is 2 hours
        
        data['access'] = str(refresh_token.access_token) #add the access token to the response data
        data['refresh'] = str(refresh_token) #add the refresh token to the response data

        return data #return the response data with the access and refresh tokens

class SendCodeSerializer(serializers.Serializer): #serializer for sending verification codes
    email = serializers.EmailField() #serialize the single email field