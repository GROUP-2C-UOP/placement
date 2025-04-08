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

"""
    All but one class within this file have parameters that follow the pattern generics.xyzAPIVIEW.
    This is because the classes use Django's prebuilt classes to provide common CRUD functionalities.
    Django's generic views are prebuilt views that provide standard functionality for common operations.
    These generic views already include the logic of returing the appropriate data and status codes. So it isn't explicitly coded within some of the Views within this file.
    
    These include:
    - ListCreateAPIView: Used for listing and creating objects in a single view
    - CreateAPIView: Used for handling the creation of an object
    - DestroyAPIView: Used for handling the deletion of an object
    - UpdateAPIView: Used for handling the changing of an object's fields
    - GenericAPIView: A base class for custom views, providing general functionality like handling HTTP methods
    - RetrieveAPIView: Used for handling the retrieval of a single object

    **THE OBJECT THAT NEEDS TO BE UPDATED/DELETED IS SPECIFIED BY IT'S PRIMARY KEY WITHIN THE ASSOICATED URL (LOOK AT URLS.PY)**


    General Structure for Views:
    ============================
    class Name(generics.xyzAPIView)                                 ---> the view the class uses based on Django's generics library
        serializer_class = serializer                               ---> the serializer the view uses to validate incoming data and convert returns
        permission_classes = [IsAuthenticated/AllowAny]             ---> the permission class defines who is allowed to access the view, authenticated users or anyone

        def get_queryset(self)                                      ---> function that automatically defines the dataset the view works on
            user = self.request.user                                ---> retrieve the user making the request
            data = Object.objects.filter(user=user)                 ---> filter the objects where the foreign key USER matches the currently authenticated user
            return data                                             ---> return the data for the class to use in it's logic
    
        
        get_serializer_class(): Used where only specific fields are returned (e.g., profile picture)
                                Inherits existing associated serializer and overrides the Meta class to define what specific fields to be included

    General Return Behaviour:
    =========================
        For each view, the following status codes apply depending on the action and outcome:
            
        - List Views (e.g., ToDoListCreate):
            - 200 OK: retrieved all relevant objects and returned
            - 401 Unauthorized: user not authenticated

        - Create Views:
            - 201 Created: successfully created object
            - 400 Bad Request: invalid data provided
            - 401 Unauthorized: user not authenticated

        - Retrieve Views:
            - 200 OK: retrieved object and returned
            - 401 Unauthorized: user not authenticated
            - 404 Not Found: object does not exist 

        - Update Views:
            - 200 OK: updated object 
            - 400 Bad Request: invalid update data
            - 401 Unauthorized: user not authenticated
            - 404 Not Found: object does not exist 

        - Delete Views:
            - 204 No Content: object deleted
            - 401 Unauthorized: user not authenticated
            - 404 Not Found: object does not exist 


    
    AUTHOR OF ALL VIEWS = UP2109066/b9sit
"""


class PlacementListCreate(generics.ListCreateAPIView): 
    """
        API view for listing all placements associated to an authenticated user as well as creating new placements.
        Listing logic is already inbuilt within the generics.ListCreateAPIView.
    """
    serializer_class = PlacementSerializers
    permission_classes = [IsAuthenticated] 

    def get_queryset(self): 
        user = self.request.user 
        placements = Placement.objects.filter(user=user)

        return placements 
    
    def perform_create(self, serializer): #function for creating placement
        if serializer.is_valid(): #if incoming data is valid according to the serializer
            serializer.save(user=self.request.user) #save placement where the user is the user making the request
        else:
            print(serializer.errors) #for debugging

class PlacementDelete(generics.DestroyAPIView): 
    """
        API view for deleing placements associated to an authenticated user.
        Placement to be deleted is defined through the URL endpoint where the PK of the placement is included.
    """
    serializer_class = PlacementSerializers
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        user = self.request.user 
        return Placement.objects.filter(user=user) 

class CreateUserView(generics.CreateAPIView): #view to create users using django's generic view for creating objects
    """
        API view for creating a new user
        View relies on checking whether the email and verification code provided by the user matches that within the user verification table for the inputted email.
        This verification step is to ensure users sign up with their own emails.

        View checks if verification code provided matches one gerneated for the given email
        If valid, user is created, if not, an error response is returned with the relevant detail.
    """
    queryset = CustomUser.objects.all() 
    serializer_class = UserSerializers 
    permission_classes = [AllowAny] 

    def post(self, request, *args, **kwargs): #overrides default post value in order to add custom logic
        """
            Custom POST method to handle user registration with the verification step.
            Method retrieves the user's inputted email and verification code from the request data, validates the code against the database and ensures the code hasnt expired.
            If successful, the user is created otherwise the relevant error is returned.

            Params:
            request: the request object containing the request data
            *args: tuple of arguments passed to the method (not used but needs to be present)
            **kwargs: dict of keyword arguments passed to the method (not used but needs to be present)

            Returns:
            If successful: new user created and response of 201 returned
            If unsuccessful:
                - Invalid email or verification code ---> Returns error 400 bad request with detail of invalid email or verification code
                - Incorrect verificaation code ---> Returns error 400 bad request with detail of incorrect
                - Expried verification code ---> Returens error 400 bad request with deatil of expired
        """
        email = request.data.get("email") #get the email from the request's payload
        verification_code = request.data.get("verification_code") #get the code from the request's payload
        
        try: 
            verification_entry = UserVerification.objects.get(email=email) #retrieve the verification code generated for the user registering by retrieving it usingn the email from the payload
        except UserVerification.DoesNotExist: #if nothing is fetched
            return Response({"detail": "Invalid email or verification code."}, status=status.HTTP_400_BAD_REQUEST) #return error 400 bad request with the detail of invalid email or verification code

        if verification_entry.code != verification_code: #if the code the user inputted is not equal to the one generated for them
            return Response({"detail": "incorrect"}, status=status.HTTP_400_BAD_REQUEST) #return error 400 bad request with detail incorrect
        
        if timezone.now() > verification_entry.valid_until: #if the current time (when the view is called upon) is later than the expiration time of the generated code
            return Response({"detail": "expired"}, status=status.HTTP_400_BAD_REQUEST) #return error 400 bad request with detail expired
        
        return super().post(request, *args, **kwargs) #if all good, then create the user

class SendCode(generics.GenericAPIView): #generic api view with no built in create,update,delete methods
    """
        API view to send verification code to user's email
        Logic is all within it's post method
        View validates inbcoming email and send verification code if email is not already registered
        
        Handles updating and creation entries within UserVerification for the given email:
            if an entry of the email within the database exists, updates the generated code, the time it was created and the expiration time otherwise creates a new entry with the necessary fields

        Sends verification code to user's email using Django's send_mail function

        Returns:
            On success: Status 200 with message: code sent successfully
            On failure: error 400 bad request with detail "exists" -- for if an account has already successfully registered with the email
    """
    serializer_class = SendCodeSerializer 
    permission_classes = [AllowAny] 

    def post(self, request): 
        serializer = self.get_serializer(data=request.data) #validate incoming data using the sendcodes serlalizer
        serializer.is_valid(raise_exception=True) #check if incoming data is valid by serializer standard (if all fields are filled and appropriate) if not raise an exception
        email = serializer.validated_data["email"] #extract the email from the validated data (from the serializer)

        if CustomUser.objects.filter(email=email).exists(): #check if the user already exists using the email the user has inputted
            return Response({"detail": "exists"}, status=status.HTTP_400_BAD_REQUEST) 

        code = str(random.randint(10000, 99999)) #define the code that is generated for the user using random and is between 10000 and 99999

        try: #try to do the fetch and update UserVerification entry
            verification_entry = UserVerification.objects.get(email=email) 
            verification_entry.code = code
            verification_entry.created_at = timezone.now()  
            verification_entry.valid_until = timezone.now() + timedelta(minutes=5) 
            verification_entry.save() #save the object
        except ObjectDoesNotExist: #if the error is ObjectDoesNotExist
            verification_entry = UserVerification.objects.create( 
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

class PlacementUpdate(generics.UpdateAPIView): 
    """
        API view to update placement details for a specific user
        View allows authenticated users to update their own placement information 
    """
    serializer_class = PlacementSerializers 
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        user = self.request.user 
        return Placement.objects.filter(user=user) 
    
class ToDoListCreate(generics.ListCreateAPIView): 
    """
        API View to list and create ToDo objects
    """
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
    """
        API View to delete ToDo objects
    """
    serializer_class = ToDoSerializers 
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        user = self.request.user 
        return ToDo.objects.filter(user=user) 
    
class ToDoUpdate(generics.UpdateAPIView): 
    """
        API View to update an existing ToDo object
    """
    serializer_class = ToDoSerializers 
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        user = self.request.user 
        return ToDo.objects.filter(user=user) 
    
class GetUserDetails(generics.RetrieveAPIView):
    """
        API View to get ALL of a user's details from their model
    """
    serializer_class = UserSerializers 
    permission_classes = [IsAuthenticated] 

    def get_object(self):
        return self.request.user 
    
class GetProfilePicture(generics.RetrieveAPIView): 
    """
        API View to get only user's profile picture
    """
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
    """
        API View to get only user's name
    """
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
    """
        API View to get only user's email
    """ 
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
    """
        API View to get only user's notification status
    """
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
    """
        API View to get only user's email notification status
    """
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
    """
        API View to get only user's notification time preference
    """
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
    """
        API View to get update user's preferences via the UserPreferences table
    """
    serializer_class = UserPreferencesSerializers 
    permission_classes = [IsAuthenticated] 

    def get_object(self):
        return UserPreferences.objects.get(user=self.request.user) 
    
class PasswordUpdate(generics.UpdateAPIView):
    """
        API View to update user's password 

        Returns:
        - Status 200 ok with message "Password updated successfully"
        - Status 400 Bad Request with message "Password not provided"
    """
    serializer_class = UserSerializers 
    permission_classes = [IsAuthenticated] 

    def get_object(self):
        return self.request.user 
    
    def patch(self, request, *args, **kwargs): #override patch function to change password
        user = self.get_object() #get the user
        new_password = request.data.get('password') #set the new_password variable from the request

        if new_password: #if there is a new password
            # hash the new password and update it
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK) #if worked then return 200 successful
        return Response({"message": "Password not provided"}, status=status.HTTP_400_BAD_REQUEST) #if not then return 400 bad request
    
class UserUpdate(generics.UpdateAPIView):
    """
        API View to update any of a user's fields
    """
    serializer_class = UserSerializers 
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user 
    
class NotificationListCreate(generics.ListCreateAPIView): #view for listing and creating notification objects using django's list create api view
    """
        API View to list and create notifications for an authenticated user

        View allows for the creation of notifications by checking the user's preferences and if a notification with the relevant fields already exisits. Additionally lists all the notifications related to the user.

        Flow of function:
            1. Check if notifications are enabled
            2. Create notification for upcoming placement deadlines if it doesn't already exist
            3. Create notification for upcoming ToDo deadlines if it doesn't already exist
            4. Return a list of notifications associated to the user

        Returns:
            - 200 OK: Successfully listed notifications
            - 201 Created: Notification object created successfully
            - 400 Bad Request: Invalid data provided
            - 401 Unauthorised: User is not authenticated
    """
    serializer_class = NotificationSerializers 
    permission_classes = [IsAuthenticated]

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


    def get_queryset(self): 
        user = self.request.user 
        return Notifications.objects.filter(user=user) 
    
    def list(self, request, *args, **kwargs): #overrides default list method to autmoatically create notifications before fetching and returning user's notification list
        self.create_notifications(request.user)  
        return super().list(request, *args, **kwargs)


class NotificationDelete(generics.DestroyAPIView): 
    """
        API View to delete notification objects
    """
    serializer_class = NotificationSerializers 
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        user = self.request.user 
        return Notifications.objects.filter(user=user)
        
class NotificationBulkUpdate(APIView): #uses base API view to manually construct the PATCH logic
    """
        API View to update multiple notifications at once

        View handles bulk update of notification by accepting a list of notification data and updating each notification associated with the authenticated user.
        User can update mulitple fields in one or more notifications in a single request

        Request body must contain a list of notifications

        Returns:
        - 200 OK: Successfully updated the notifications
        - 400 Bad Request: Invalid request data
        - 401 Unauthorized: User is not authenticated
    """
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
    
class NotificationUpdate(generics.UpdateAPIView): 
    """
        API View to update the fields of a single notification object
    """
    serializer_class = NotificationSerializers 
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        user = self.request.user
        return Notifications.objects.filter(user=user) 

