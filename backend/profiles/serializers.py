from rest_framework import serializers
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", required=True)
    username = serializers.CharField(source="user.username", required=True)
    class Meta:
        model = Profile 
        fields = ['id', 'username', 'location', 'email', 'image']
 
