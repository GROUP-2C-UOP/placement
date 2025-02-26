from django.shortcuts import render
from rest_framework import generics
from .models import Profile
from .serializers import ProfileSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

class ProfileDetailView(generics.RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    parser_classes = (MultiPartParser, FormParser)

    def update(self, request):
        profile = self.get_object()
        user = profile.user 

        profile.location = request.data.get("location", profile.location)

        user.email = request.data.get("email", user.email)
        user.username = request.data.get("name", user.username)

        profile.save()
        user.save()

        return Response(ProfileSerializer(profile).data)


# api_view(['GET'])
# def profile_list(request):
#     profiles = Profile.objects.all()
#     serializer = ProfileSerializer(profiles, many=True)
#     return Response(serializer.data) 
# ^ (AI) retrieves all profiles as a list, useful for admin purposes - will be scrapped if not needed