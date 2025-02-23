from rest_framework import serializers
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    name = serializers.CharField(source="user.username", read_only=True)
    class Meta:
        model = Profile 
        fields = '__all__'
 
