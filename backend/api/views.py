from django.shortcuts import render
from rest_framework import generics
from .serializers import UserSerializers, PlacementSerializers, NotificationSerializers
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Placement, CustomUser, Notifications
from datetime import date, timedelta
from django.http import JsonResponse


class PlacementListCreate(generics.ListCreateAPIView):
    serializer_class = PlacementSerializers
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        placements = Placement.objects.filter(user=user)

        for placement in placements:
            deadline_days = (placement.next_stage_deadline - date.today()).days

            if deadline_days <= 3:
                Notifications.objects.get_or_create(
                    user=user,
                    company=placement.company,
                    role=placement.role,
                    days=deadline_days,
                    status=placement.status
                )

        return placements
    
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


class PlacementUpdate(generics.UpdateAPIView):
    serializer_class = PlacementSerializers
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Placement.objects.filter(user=user)
    
class GetUserName(generics.RetrieveAPIView):
    serializer_class = UserSerializers
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    def get_serializer_class(self):
        class UserNameSerializer(UserSerializers):
            class Meta(UserSerializers.Meta):
                fields = ["first_name"]

        return UserNameSerializer
    

class NotificationListCreate(generics.ListCreateAPIView):
    serializer_class = NotificationSerializers
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Notifications.objects.filter(user=user)

class NotificationDelete(generics.DestroyAPIView):
    serializer_class = NotificationSerializers
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Notifications.objects.filter(user=user)