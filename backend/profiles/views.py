from django.shortcuts import render
from rest_framework import generics
from .models import Profile
from .serializers import ProfileSerializer

def profile_page(request): # DO WE NEED THIS FUNCTION?
    return render(request, 'profiles/profile.html')

class ProfileDetailView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer