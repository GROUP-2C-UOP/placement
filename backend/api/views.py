from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializers, PlacementSerializers, ToDoSerializers, NotificationSerializers, UserPreferencesSerializers, SendCodeSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Placement, ToDo, CustomUser, Notifications, UserPreferences, UserVerification
from datetime import date, timedelta
from django.core.mail import send_mail
from django.conf import settings
import random
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist


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

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        verification_code = request.data.get("verification_code")
        
        print(f"THIS IS THE VERIFICATION CODE YOU SENT: {verification_code}")
        print(f"Type of verification code sent: {type(verification_code)}")

        try:
            verification_entry = UserVerification.objects.get(email=email)
        except UserVerification.DoesNotExist:
            return Response({"detail": "Invalid email or verification code."}, status=status.HTTP_400_BAD_REQUEST)

        print(f"THIS IS THE VERIFICATION CODE THAT SHOULD BE USED: {verification_entry.code}")
        print(f"Type of verification code in the database: {type(verification_entry.code)}")
        print(f"Verification entry: {verification_entry}")
        print(f"Valid until: {verification_entry.valid_until}")
        print(f"Current time: {timezone.now()}")

        if verification_entry.code != verification_code:
            return Response({"detail": "incorrect"}, status=status.HTTP_400_BAD_REQUEST)
        
        if timezone.now() > verification_entry.valid_until:
            return Response({"detail": "expired"}, status=status.HTTP_400_BAD_REQUEST)
        
        return super().post(request, *args, **kwargs)

class SendCode(generics.GenericAPIView):
    serializer_class = SendCodeSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        if CustomUser.objects.filter(email=email).exists():
            return Response({"detail": "exists"}, status=status.HTTP_400_BAD_REQUEST)

        code = str(random.randint(10000, 99999))

        try:
            verification_entry = UserVerification.objects.get(email=email)
            verification_entry.code = code
            verification_entry.created_at = timezone.now()  # Update timestamp
            verification_entry.valid_until = timezone.now() + timedelta(minutes=5)
            verification_entry.save()
        except ObjectDoesNotExist:
            verification_entry = UserVerification.objects.create(
                email=email, code=code, created_at=timezone.now(), valid_until=timezone.now() + timedelta(minutes=5)
            )

        subject = "Career Compass - Account Creation"
        message = f"Welcome to Career Compass!\n\nBefore you get started, confirm your account with this code:\n\n{code}\n\nBest regards,\nCareer Compass Team!"

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=True
        )

        return Response({"message": "Code sent successfully."}, status=200)

class PlacementUpdate(generics.UpdateAPIView):
    serializer_class = PlacementSerializers
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Placement.objects.filter(user=user)
    
class ToDoListCreate(generics.ListCreateAPIView):
    serializer_class = ToDoSerializers
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        todos = ToDo.objects.filter(user=user)

        return todos
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)

class ToDoDelete(generics.DestroyAPIView):
    serializer_class = ToDoSerializers
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ToDo.objects.filter(user=user)
    
class ToDoUpdate(generics.UpdateAPIView):
    serializer_class = ToDoSerializers
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ToDo.objects.filter(user=user)
    
class GetUserDetails(generics.RetrieveAPIView):
    serializer_class = UserSerializers
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class GetProfilePicture(generics.RetrieveAPIView):
    serializer_class = UserSerializers
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    def get_serializer_class(self):
        class ProfilePictureSerializer(UserSerializers):
            class Meta(UserSerializers.Meta):
                fields = ["profile_picture"]

        return ProfilePictureSerializer
    
    
class GetUserName(generics.RetrieveAPIView):
    serializer_class = UserSerializers
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    def get_serializer_class(self):
        class UserNameSerializer(UserSerializers):
            class Meta(UserSerializers.Meta):
                fields = ["first_name", "last_name"]

        return UserNameSerializer
    
class GetEmail(generics.RetrieveAPIView):
    serializer_class = UserSerializers
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    def get_serializer_class(self):
        class EmailSerializer(UserSerializers):
            class Meta(UserSerializers.Meta):
                fields = ["email"]
        return EmailSerializer
    
class GetNotificationStatus(generics.RetrieveAPIView):
    serializer_class = UserPreferencesSerializers
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return UserPreferences.objects.get(user=self.request.user)
    
    def get_serializer_class(self):
        class StatusSerializer(UserPreferencesSerializers):
            class Meta(UserPreferencesSerializers.Meta):
                fields = ["notification_enabled"]
        return StatusSerializer
    
class GetEmailNotificationStatus(generics.RetrieveAPIView):
    serializer_class = UserPreferencesSerializers
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return UserPreferences.objects.get(user=self.request.user)
    
    def get_serializer_class(self):
        class StatusSerializer(UserPreferencesSerializers):
            class Meta(UserPreferencesSerializers.Meta):
                fields = ["email_notification_enabled"]
        return StatusSerializer
    
class GetNotificationTime(generics.RetrieveAPIView):
    serializer_class = UserPreferencesSerializers
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return UserPreferences.objects.get(user=self.request.user)
    
    def get_serializer_class(self):
        class TimeSerializer(UserPreferencesSerializers):
            class Meta(UserPreferencesSerializers.Meta):
                fields = ["notification_time"]
        return TimeSerializer
    
class NotificationSettingsUpdate(generics.UpdateAPIView):
    serializer_class = UserPreferencesSerializers
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return UserPreferences.objects.get(user=self.request.user)
    
class PasswordUpdate(generics.UpdateAPIView):
    serializer_class = UserSerializers
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    def patch(self, request, *args, **kwargs): #this class has param of updateAPIView so the code knows to automatically trigger this patch function
        user = self.get_object()
        new_password = request.data.get('password')

        if new_password:
            # hash the new password and update it
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)
        return Response({"message": "Password not provided"}, status=status.HTTP_400_BAD_REQUEST)
    
class UserUpdate(generics.UpdateAPIView):
    serializer_class = UserSerializers
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class NotificationListCreate(generics.ListCreateAPIView):
    serializer_class = NotificationSerializers
    permission_classes = [IsAuthenticated]

    def create_notifications(self, user):
        try:
            user_preferences = UserPreferences.objects.get(user=user)
            if not user_preferences.notification_enabled:
                return
            notification_time = user_preferences.notification_time  
        except UserPreferences.DoesNotExist:
            notification_time = 3

        placements = Placement.objects.filter(user=user)
        self.create_placement_notifications(user, placements, notification_time)

        todos = ToDo.objects.filter(user=user)
        self.create_todo_notifications(user, todos, notification_time)

    def create_placement_notifications(self, user, placements, notification_time):
        for placement in placements:
            if placement.next_stage_deadline:
                deadline_days = (placement.next_stage_deadline - date.today()).days
                if 0 <= deadline_days <= notification_time and placement.status not in ["applied", "offer_made", "rejected", "withdrawn"]:
                    existing_notification = Notifications.objects.filter(
                        user=user,
                        placement=placement,
                        company=placement.company,
                        role=placement.role,
                        description=placement.description,
                        shown=True
                    ).first()

                    if not existing_notification:
                        print(f"Creating placement notification for {placement.company} - {placement.role}")
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
                

    def create_todo_notifications(self, user, todos, notification_time):
        for todo in todos:
            if todo.next_stage_deadline:
                deadline_days = (todo.next_stage_deadline - date.today()).days
                if 0 <= deadline_days <= notification_time:
                    existing_notification = Notifications.objects.filter(
                        user=user,
                        todo=todo,
                        company=todo.company,
                        role=todo.role,
                        description=todo.description,
                        shown=True
                    ).first()

                    print(existing_notification.days if existing_notification else "No existing notification") 


                    if not existing_notification:
                        print(f"Creating todo notification for {todo.company} - {todo.role}")
                        Notifications.objects.create(
                            user=user,
                            todo=todo,
                            company=todo.company,
                            role=todo.role,
                            description=todo.description,
                            days=deadline_days,
                            shown=False,
                            read=False,
                            emailed=False
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

