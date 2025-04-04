from rest_framework import generics, status #import django's generics for common api views: list, create, update, delete views
from rest_framework.views import APIView #import for creation of custom api views
from rest_framework.response import Response #to return HTTP responses 
from .serializers import UserSerializers, PlacementSerializers, ToDoSerializers, NotificationSerializers, UserPreferencesSerializers, SendCodeSerializer #import seralizers for each view
from rest_framework.permissions import IsAuthenticated, AllowAny #permission classes for restricting access to views
from .models import Placement, ToDo, CustomUser, Notifications, UserPreferences, UserVerification #import custom models
from datetime import date, timedelta #used in verification code expiration
from django.core.mail import send_mail #used in send code view
from django.conf import settings #to retrieve the default_from_email
import random #for generating random verification code
from django.utils import timezone #to retrieve the current time
from django.core.exceptions import ObjectDoesNotExist #for checking if an object exists and raising an error if not


class PlacementListCreate(generics.ListCreateAPIView): #view to list all placements for a user and allow creation of a new one, through django's generic view for creating objects
    serializer_class = PlacementSerializers #use the placement serializer for this view
    permission_classes = [IsAuthenticated] #only authenticated (logged in) users are allowed

    def get_queryset(self): #get placements that are associated with the logged in user
        user = self.request.user #get the user making the request
        placements = Placement.objects.filter(user=user) #from all placements within the db, return those where the user field is the user making the request

        return placements 
    
    def perform_create(self, serializer): #save new placement and assign it to the logged in user making the request
        if serializer.is_valid(): #if incoming data is valid by its serializer
            serializer.save(user=self.request.user) #save placement where the user is the user making the request
        else:
            print(serializer.errors) #for debugging

class PlacementDelete(generics.DestroyAPIView): #uses django's generic destroy api view to delete objects passed to it
    serializer_class = PlacementSerializers #use the placement serializer for this view
    permission_classes = [IsAuthenticated] #only authenticated (logged in) users are allowed

    def get_queryset(self):
        user = self.request.user #get user making the request
        return Placement.objects.filter(user=user) #from all placements within the db, return those where the user field is the user making the request

class CreateUserView(generics.CreateAPIView): #view to create users using django's generic view for creating objects
    queryset = CustomUser.objects.all() #required for createAPIView but not really used
    serializer_class = UserSerializers #use the user serializer for validation
    permission_classes = [AllowAny] #allows any one to access this view

    def post(self, request, *args, **kwargs): #overrides default post value in order to add custom logic, *args = arguments & *kwargs = keyword arguments
        email = request.data.get("email") #get the email from the request's payload
        verification_code = request.data.get("verification_code") #get the code from the request's payload
        
        print(f"THIS IS THE VERIFICATION CODE YOU SENT: {verification_code}") #this is for debugging
        print(f"Type of verification code sent: {type(verification_code)}") #this is for debugging

        try: 
            verification_entry = UserVerification.objects.get(email=email) #retrieve thee verification code generated for the user registering by retrieving it usingn the email from the payload
        except UserVerification.DoesNotExist: #if nothing is fetched
            return Response({"detail": "Invalid email or verification code."}, status=status.HTTP_400_BAD_REQUEST) #return error 400 bad request with the detail of invalid email or verification code

        print(f"THIS IS THE VERIFICATION CODE THAT SHOULD BE USED: {verification_entry.code}") #for debugging
        print(f"Type of verification code in the database: {type(verification_entry.code)}") #for debugging
        print(f"Verification entry: {verification_entry}") #for debugging
        print(f"Valid until: {verification_entry.valid_until}") #for debugging
        print(f"Current time: {timezone.now()}") #for debugging

        if verification_entry.code != verification_code: #if the code the user inputted is not equal to the one generated for them
            return Response({"detail": "incorrect"}, status=status.HTTP_400_BAD_REQUEST) #return error 400 bad request with detail incorrect
        
        if timezone.now() > verification_entry.valid_until: #if the current time (when the view is called upon) is later than the expiration time of the generated code
            return Response({"detail": "expired"}, status=status.HTTP_400_BAD_REQUEST) #return error 400 bad request with detail expired
        
        return super().post(request, *args, **kwargs) #if all good, then create the user

class SendCode(generics.GenericAPIView): #generic api view with no built in create,update,delete methods
    serializer_class = SendCodeSerializer #use sendcode serializer
    permission_classes = [AllowAny] #allow any user to use this view

    def post(self, request): #post request
        serializer = self.get_serializer(data=request.data) #validate incoming data using the sendcodes serlalizer
        serializer.is_valid(raise_exception=True) #check if incoming data is valid by serializer standard (if all fields are filled and appropriate) if not raise an exception
        email = serializer.validated_data["email"] #extract the email from the validated data (from the serializer)

        if CustomUser.objects.filter(email=email).exists(): #check if the user already exists using the email the user has inputted
            return Response({"detail": "exists"}, status=status.HTTP_400_BAD_REQUEST) #if so return 400 bad request with detail exists

        code = str(random.randint(10000, 99999)) #define the code that is generated for the user using random and is between 10000 and 99999

        try: #if an entry exists, upate the code, created at and valid until fields (avoids duplication of entries and allows for an email to be used for sign up again if failed to sign up previously)
            verification_entry = UserVerification.objects.get(email=email) 
            verification_entry.code = code
            verification_entry.created_at = timezone.now()  # update timestamp
            verification_entry.valid_until = timezone.now() + timedelta(minutes=5) #update expiration date
            verification_entry.save() #save the object
        except ObjectDoesNotExist: #if the entry doesn't exist
            verification_entry = UserVerification.objects.create( #create a new instance of UserVerification where the email is the email the user inputted, the code is the one generated previously, created at is the current time and its valid until 5 minutes from now
                email=email, code=code, created_at=timezone.now(), valid_until=timezone.now() + timedelta(minutes=5)
            )

        subject = "Career Compass - Account Creation" #define the subject of the email
        message = f"Welcome to Career Compass!\n\nBefore you get started, confirm your account with this code:\n\n{code}\n\nBest regards,\nCareer Compass Team!" #define the message of the email

        send_mail( #actual function for sending emails
            subject, 
            message,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=True
        )

        return Response({"message": "Code sent successfully."}, status=200) #return status 200 meaning successful with the message being code sent successfuly

class PlacementUpdate(generics.UpdateAPIView): #view to update placement objects using put and patch via django's prebuilt update api view
    serializer_class = PlacementSerializers #use placement serializer
    permission_classes = [IsAuthenticated] #only logged in users can access this view

    def get_queryset(self):
        user = self.request.user #define user as the one making the request
        return Placement.objects.filter(user=user) #to get the data that the user is working with, filter where the user field is the user variable defined above
    
class ToDoListCreate(generics.ListCreateAPIView): #api view to list and create to do objests, param is django's prebuilt view allowing for listing and creation
    serializer_class = ToDoSerializers #use to do serializer to validate data
    permission_classes = [IsAuthenticated] #only logged in users can use this view

    def get_queryset(self): #retrieve the data the view works with
        user = self.request.user #get the user making the request
        todos = ToDo.objects.filter(user=user) #use only their to do objects 

        return todos
    
    def perform_create(self, serializer): #method for creating objects
        if serializer.is_valid(): #if the inputted data is valid
            serializer.save(user=self.request.user) #save with the associated user
        else:
            print(serializer.errors) #for debugging

class ToDoDelete(generics.DestroyAPIView): #view for deletion
    serializer_class = ToDoSerializers #use to do serializer
    permission_classes = [IsAuthenticated] #only logged in users can use this view

    def get_queryset(self):
        user = self.request.user #get the user making the request
        return ToDo.objects.filter(user=user) #limit the data to only the todo objects associated with the request user
    
class ToDoUpdate(generics.UpdateAPIView): #view for updating
    serializer_class = ToDoSerializers #use to do serializer
    permission_classes = [IsAuthenticated] #only logged in users can use this view

    def get_queryset(self):
        user = self.request.user #get the user making the request
        return ToDo.objects.filter(user=user) #limit the data to only the todo objects associated with the request user
    
class GetUserDetails(generics.RetrieveAPIView): #view for retrieval of the user (their detials are included in the return)
    serializer_class = UserSerializers #use user serializer
    permission_classes = [IsAuthenticated] #only logged in users can use this view

    def get_object(self):
        return self.request.user #return the user making the request
    
class GetProfilePicture(generics.RetrieveAPIView): #get the users profile picture using django's prebuilt retrieve api view
    serializer_class = UserSerializers #use user serializer
    permission_classes = [IsAuthenticated] #only logged in users can use this view

    def get_object(self):
        return self.request.user #return the user making the request
    
    def get_serializer_class(self):
        class ProfilePictureSerializer(UserSerializers): #custom serializer using user serializer
            class Meta(UserSerializers.Meta): #where the only fields that is processed is the profile_picture 
                fields = ["profile_picture"]

        return ProfilePictureSerializer
    
    
class GetUserName(generics.RetrieveAPIView):  #get the users name using django's prebuilt retrieve api view
    serializer_class = UserSerializers #use user serializer
    permission_classes = [IsAuthenticated] #only logged in users can use this view

    def get_object(self):
        return self.request.user #return the user making the request
    
    def get_serializer_class(self):
        class UserNameSerializer(UserSerializers): #custom serializer using user serializer
            class Meta(UserSerializers.Meta):  #where the only fields that is processed is the first and last name
                fields = ["first_name", "last_name"]

        return UserNameSerializer
    
class GetEmail(generics.RetrieveAPIView): #get the users email using django's prebuilt retrieve api view
    serializer_class = UserSerializers #use user serializer
    permission_classes = [IsAuthenticated] #only logged in users can use this view

    def get_object(self):
        return self.request.user #return the user making the request
    
    def get_serializer_class(self):
        class EmailSerializer(UserSerializers): #custom serializer using user serializer
            class Meta(UserSerializers.Meta): #where the only fields that is processed is the email
                fields = ["email"]
        return EmailSerializer
    
class GetNotificationStatus(generics.RetrieveAPIView): #view to get the user notification status using django's retrieve api view
    serializer_class = UserPreferencesSerializers #use user preferences serializer as the serializer to validate the data
    permission_classes = [IsAuthenticated] #only logged in users can use this view

    def get_object(self):
        return UserPreferences.objects.get(user=self.request.user) #get the user preferences object linked to the user
    
    def get_serializer_class(self):
        class StatusSerializer(UserPreferencesSerializers): #custom serializer using the user preferences serializer
            class Meta(UserPreferencesSerializers.Meta): #from the userpreferences serializer only process the notification_enabled field
                fields = ["notification_enabled"]
        return StatusSerializer
    
class GetEmailNotificationStatus(generics.RetrieveAPIView): #view to get the email notification status using django's retrieve api view
    serializer_class = UserPreferencesSerializers #use user preferences serializer as the serializer to validate the data
    permission_classes = [IsAuthenticated] #only logged in users can use this view

    def get_object(self):
        return UserPreferences.objects.get(user=self.request.user) #get the user preferences object linked to the user
    
    def get_serializer_class(self):
        class StatusSerializer(UserPreferencesSerializers): #custom serializer using the user preferences serializer
            class Meta(UserPreferencesSerializers.Meta): #from the userpreferences serializer only process the email_notification_enabled field
                fields = ["email_notification_enabled"]
        return StatusSerializer
    
class GetNotificationTime(generics.RetrieveAPIView): #view to get the user notification time using django's retrieve api view
    serializer_class = UserPreferencesSerializers #use user preferences serializer as the serializer to validate the data
    permission_classes = [IsAuthenticated] #only logged in users can use this view

    def get_object(self):
        return UserPreferences.objects.get(user=self.request.user) #get the user preferences object linked to the user
    
    def get_serializer_class(self):
        class TimeSerializer(UserPreferencesSerializers): #custom serializer using the user preferences serializer
            class Meta(UserPreferencesSerializers.Meta): #from the userpreferences serializer only process the notification_time field
                fields = ["notification_time"]
        return TimeSerializer
    
class NotificationSettingsUpdate(generics.UpdateAPIView): #view for updating values within userpreferences objects using put and patch via django's prebuilt update api view
    serializer_class = UserPreferencesSerializers #use user preferences serializer as the serializer to validate the data
    permission_classes = [IsAuthenticated] #only logged in users can use this view

    def get_object(self):
        return UserPreferences.objects.get(user=self.request.user) #get the user preferences object linked to the user
    
class PasswordUpdate(generics.UpdateAPIView): #view to allow user to change their password using django's prebuilt update api view
    serializer_class = UserSerializers #use the user serializer as the serializer 
    permission_classes = [IsAuthenticated] #only logged in users can access this view

    def get_object(self):
        return self.request.user #get the user making the request
    
    def patch(self, request, *args, **kwargs): #override patch function to change password
        user = self.get_object() #get the user
        new_password = request.data.get('password') #set the new_password variable from the request

        if new_password: #if there is a new password
            # hash the new password and update it
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK) #if worked then return 200 successful
        return Response({"message": "Password not provided"}, status=status.HTTP_400_BAD_REQUEST) #if not then return 400 bad request
    
class UserUpdate(generics.UpdateAPIView): #view for updating any of the user's fields
    serializer_class = UserSerializers #serializer class is the user serializer
    permission_classes = [IsAuthenticated] #only logged in users can access this view

    def get_object(self):
        return self.request.user #get the user making the request in order to update their data
    
class NotificationListCreate(generics.ListCreateAPIView): #view for listing and creating notification objects using django's list create api view
    serializer_class = NotificationSerializers #use serializer notificationserializers to validate the data
    permission_classes = [IsAuthenticated] #make the view only available to those authenticated

    def create_notifications(self, user): #function to create notification
        try:
            user_preferences = UserPreferences.objects.get(user=user) #get the userpreferences object associated with the user
            if not user_preferences.notification_enabled: #if notifications arent enabled for the user then return nothing, ending the function
                return
            notification_time = user_preferences.notification_time #have the notification time stored for checking when to create the notification  
        except UserPreferences.DoesNotExist: #if userpreferences doesnt exist then set notification time as 3 by default
            notification_time = 3

        placements = Placement.objects.filter(user=user) #fetch all the placemetns of the user
        self.create_placement_notifications(user, placements, notification_time) #call create placmeent notifications of the notificationlistcreate class with the appropritate params

        todos = ToDo.objects.filter(user=user) #fetch all the todos of thje user
        self.create_todo_notifications(user, todos, notification_time) #call create todo notifications of the notificationlistcreate class with the appropriate params

    def create_placement_notifications(self, user, placements, notification_time): #the createplacementnotifications function to create placment notficiations called a few lines up
        for placement in placements: #for every placement within placements
            if placement.next_stage_deadline: #if the placement has a next_stage_deadline field
                deadline_days = (placement.next_stage_deadline - date.today()).days #have deadline_days be the next_stage_deadline take away todays date in days
                if 0 <= deadline_days <= notification_time and placement.status not in ["applied", "offer_made", "rejected", "withdrawn"]: #if the calculated deadline_days is between 0 and the notification_time the user wants within user preferences, and also placmment status is not in that list
                    existing_notification = Notifications.objects.filter( #check if the notification already exists within the database using the filtered parameters
                        user=user,
                        placement=placement,
                        company=placement.company,
                        role=placement.role,
                        description=placement.description,
                        shown=True
                    ).first()

                    if not existing_notification: #if the notification doesnt exist
                        print(f"Creating placement notification for {placement.company} - {placement.role}") #for debugging
                        Notifications.objects.create( #create the notification object for the placement with the appropriate values
                            user=user,
                            placement=placement,
                            company=placement.company,
                            role=placement.role,
                            description=placement.description,
                            days=deadline_days,
                            status=placement.status,
                            shown=False, 
                            read=False,
                            emailed=False #have shown, read and emailed be false so that they can be popped up within the website, added to the notification tab and emailed when necessary
                        )
                

    def create_todo_notifications(self, user, todos, notification_time): #the createtodonotifications function to create placment notficiations called a few lines up
        for todo in todos: #for every todo in todos
            if todo.next_stage_deadline: #if the todo has a next_stage_deadline field
                deadline_days = (todo.next_stage_deadline - date.today()).days #do the same caluclation as before
                if 0 <= deadline_days <= notification_time: #do the same calculation as before
                    existing_notification = Notifications.objects.filter( #do the same filtering but this time using todo values
                        user=user,
                        todo=todo,
                        company=todo.company,
                        role=todo.role,
                        description=todo.description,
                        shown=True
                    ).first()

                    print(existing_notification.days if existing_notification else "No existing notification")  #for debugging


                    if not existing_notification: #if the notification doesnt exist
                        print(f"Creating todo notification for {todo.company} - {todo.role}") #for debugging
                        Notifications.objects.create( #create the notification object for the todo with the appropriate todo values
                            user=user,
                            todo=todo,
                            company=todo.company,
                            role=todo.role,
                            description=todo.description,
                            days=deadline_days,
                            shown=False,
                            read=False,
                            emailed=False  #have shown, read and emailed be false so that they can be popped up within the website, added to the notification tab and emailed when necessary
                        )


    def get_queryset(self): #define the query set for the view to work with
        user = self.request.user #define the user as the one making the request
        return Notifications.objects.filter(user=user) #have the queryset be all notifications that the user has associated to them
    
    def list(self, request, *args, **kwargs): #overrides default list method to autmoatically create notifications before fetching and returning user's notification list
        self.create_notifications(request.user)  
        return super().list(request, *args, **kwargs)


class NotificationDelete(generics.DestroyAPIView): #view for deleting notifications
    serializer_class = NotificationSerializers #use the notificaiton serializer as the serializer
    permission_classes = [IsAuthenticated] #only logged in users can use this view

    def get_queryset(self):
        user = self.request.user #set user variable as the user making the request
        return Notifications.objects.filter(user=user) #set the data that the view works upon as the notifications associated to the user making the request
        
class NotificationBulkUpdate(APIView): #uses base API view to manually construct the PATCH logic
    serializer_class = NotificationSerializers #use notification serializers as the serializer
    permission_classes = [IsAuthenticated] #only logged in users can use this view

    def patch(self, request, *args, **kwargs):
        user = request.user #where the user is the user making the request
        data = request.data #where the data is the data being passed within the body of the request

        if not isinstance(data, list): #if the data is not a list
            return Response({"error": "Expected a list of notifications"}, status=status.HTTP_400_BAD_REQUEST) #return bad request with error stating that the data needs to be a list
        
        updated_notifications = [] #initialise an array to hold successfully updated notifications ----> for debugging
        for item in data: #for every item within the request data
            notification = Notifications.objects.filter(id=item["id"], user=user).first() #find the notification by id
            if notification: #if there is one
                for key, value in item.items(): 
                    setattr(notification, key, value) #set each field in the notification object with the new value
                notification.save() #save the updated notification object in the database
                updated_notifications.append(NotificationSerializers(notification).data) #serialize the updated notification and add it to the list

        return Response({"updated_notifications": updated_notifications}, status=status.HTTP_200_OK) #return response 200 successful and show all the updated notifications within the body of the response
    
class NotificationUpdate(generics.UpdateAPIView): #updating of a single notification
    serializer_class = NotificationSerializers #use notification serializer
    permission_classes = [IsAuthenticated] #only logged in users can use this view

    def get_queryset(self):
        user = self.request.user #get the user who is making the request
        return Notifications.objects.filter(user=user) #return the data as all the notification objects that the user has associated to them

