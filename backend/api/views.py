from django.shortcuts import render
from rest_framework import generics
from .serializers import UserSerializers, PlacementSerializers
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Placement, CustomUser
from django.http import JsonResponse


class PlacementListCreate(generics.ListCreateAPIView):
    serializer_class = PlacementSerializers
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Placement.objects.filter(user=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)

class PlacementDelete(generics.DestroyAPIView):
    serializer_class = PlacementSerializers
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Placement.objects.filter(user=user)

class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializers
    permission_classes = [AllowAny]


# def get_status_choices(request):
#     choices = Placement.STATUS_CHOICES  # Your status choices data
#     return JsonResponse(choices, safe=False)  # Return it as a JSON response

  

