from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
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

    def create_notifications(self, user):
        placements = Placement.objects.filter(user=user)

        for placement in placements:
            if placement.next_stage_deadline:
                deadline_days = (placement.next_stage_deadline - date.today()).days

                if deadline_days <= 3 and placement.status not in ["applied", "offer_made", "rejected", "withdrawn"]:
                    existing_notification = Notifications.objects.filter(
                        user=user,
                        placement=placement,
                        company=placement.company,
                        role=placement.role,
                        status=placement.status,
                        description=placement.description,
                        days=deadline_days,
                        shown=True
                    ).first()

                    if not existing_notification:
                        Notifications.objects.create(
                            user=user,
                            placement=placement,
                            company=placement.company,
                            role=placement.role,
                            description=placement.description,
                            days=deadline_days,
                            status=placement.status,
                            shown=False,
                            read=False
                        )

    def get_queryset(self):
        user = self.request.user
        return Notifications.objects.filter(user=user)
    
    def list(self, request, *args, **kwargs): #automatically create notifications when fetch notification list occurs
        self.create_notifications(request.user)  
        return super().list(request, *args, **kwargs)


class NotificationDelete(generics.DestroyAPIView):
    serializer_class = NotificationSerializers
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Notifications.objects.filter(user=user)
        
class NotificationBulkUpdate(APIView):
    serializer_class = NotificationSerializers
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        user = request.user
        data = request.data

        if not isinstance(data, list):
            return Response({"error": "Expected a list of notifications"}, status=status.HTTP_400_BAD_REQUEST)
        
        updated_notifications = []
        for item in data:
            notification = Notifications.objects.filter(id=item["id"], user=user).first()
            if notification:
                for key, value in item.items():
                    setattr(notification, key, value)
                notification.save()
                updated_notifications.append(NotificationSerializers(notification).data)

        return Response({"updated_notifications": updated_notifications}, status=status.HTTP_200_OK)
    
class NotificationUpdate(generics.UpdateAPIView):
    serializer_class = NotificationSerializers
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Notifications.objects.filter(user=user)

