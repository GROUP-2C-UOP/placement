from rest_framework import serializers
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = 'profiles.Profile' # lazy import incase profile imported before models.py has finished loading
        fields = '__all__' 
