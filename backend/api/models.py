from django.db import models #imports django's orm models
from django.contrib.auth.models import AbstractUser #imports django's customisable user model
from django.db.models.signals import post_save #imports singal to trigger functions after a model's save
from django.dispatch import receiver #imports reciever to handle signals
from datetime import timedelta #imports timedelta to calulate time-based values
from django.utils import timezone #imports timezone to retrieve the current time

STATUS_CHOICES = [ #status choices for placements and notifications where first value is the value and second is the string equivelant
    ('applied', 'Applied'),
    ('phone_interview', 'Phone Interview'),
    ('face_to_face_interview', 'Face to Face Interview'),
    ('assessment', 'Assessment'),
    ('rejected', 'Rejected'),
    ('offer_made', 'Offer Made'),
    ('withdrawn', 'Withdrawn'),
]

class CustomUser(AbstractUser): #custom user. used custom not djano's default user as i wanted username field to also be the email field
    email = models.EmailField(unique=True)  #unique is flagged as true so that there arent duplicate usernames
    profile_picture = models.ImageField(upload_to="profiles/", null=True, blank=True) #profile pictures can be set later so they can be null and blank on creation. uploaded images will be stored within the profiles directory within the media directory

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name'] #first and last names need to be required
    
def default_valid_until(): #function to calculate when the verification code expires, 5 minutes from now
    return timezone.now() + timedelta(minutes=5) 

class UserVerification(models.Model):
    email = models.EmailField(unique=True) #saves the email that the user wants to sign up with
    code = models.CharField(max_length=6) #the code generated within the sendcode view
    created_at = models.DateTimeField(auto_now_add=True) #time stamp that automatically is assigned on creation
    valid_until = models.DateTimeField(default=default_valid_until) #datetime value that defines when the verification code is valid till, default=default_valid_until means this field is automatically assigned with default_valid_until function 
    
class UserPreferences(models.Model): #table for storing each user's preferences in relation to notifications, email notifications, and when notifications should be delivered
    notification_enabled = models.BooleanField(default=True) #in-app notifications will be on automatically
    email_notification_enabled = models.BooleanField(default=True) #email notifications will be on automatically
    notification_time = models.IntegerField(default=3) #number of days before a deadline when a notification is sent
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE) #foreign key to link a user with their preferneces, on_delete = cascade means that if the user is deleted so is their respective userpreferences table they are linked to

@receiver(post_save, sender=CustomUser) #signal reciever so when a customuser instance is created, userpreferences is also made automatically
def create_user_preferences(sender, instance, created, **kwargs):
    """parameters: 
        sender = custom user that sent signal to trigger function 
        instance = object that was saved, custom user
        created = boolean flag to tell if custom user was created
        """
    if created: # if user is newly created
        UserPreferences.objects.create(user=instance) #create user preferences model which is linked to newly created custom user

class Placement(models.Model): #placement model for placments that the user is tracking
    company = models.CharField(max_length=100) #name of company with a max length of 100
    role = models.CharField(max_length=100) #role that user has applied for with max length of 100
    salary = models.FloatField(null=True) #salary offered (optional)
    starting_date = models.DateField(null=True) #start date of placement (optional)
    duration = models.IntegerField(null=True) #duration of placement in months (optional)
    next_stage_deadline = models.DateField(null=True) #deadline of a status (optional) 
    placement_link = models.URLField(null=True) #url link to placement listing (optional) 
    date_applied = models.DateField() #date the placement was applied for, not auto added as a user may want to add an old placement they forgot to add
    status = models.CharField(max_length=22, choices=STATUS_CHOICES, null=True, blank=True) #status the placement is on, choices = STATUS_CHOICES restricts the field to the predefined choices defined at the start of this file (optional)
    cv = models.FileField(upload_to='resumes/', null=True, blank=True) #file field that uploads to media directory's resumes directory (optional)
    cover_letter = models.FileField(upload_to='cover_letters/', null=True, blank=True) #file field that uploads to media directory's cover_letters directory (optional)
    contact = models.CharField(max_length=150, null=True) #contact detail for the placement, is charfield with max length of 150 so user can put anything whether it be email or number or anything else (optional)
    description = models.TextField(null=True, blank=True) #field for user adding notes for the placement (optional)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE) #link placement to user
    
class ToDo(models.Model): #todo model for applications that user wants to do
    company = models.CharField(max_length=100) #name of company with a max length of 100
    role = models.CharField(max_length=100) #role that user wants to apply for with max length of 100
    salary = models.FloatField(null=True) #salary offered (optional)
    starting_date = models.DateField(null=True) #start date of placement (optional)
    duration = models.IntegerField(null=True) #duration of placement in months (optional)
    next_stage_deadline = models.DateField(null=True) #deadline for application. called next_stage_deadline because forgot to change it oops <---- dont do this!!!!
    placement_link = models.URLField(null=True) #url link to placement listing (optional) 
    description = models.TextField(null=True, blank=True) #field for user adding notes for the application (optional)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE) #link to do to user

class Notifications(models.Model): #notification model for users
    company = models.CharField(max_length=100) #name of company with a max length of 100
    role = models.CharField(max_length=100) #role that user is being notified for
    days = models.IntegerField() #days before deadline
    status = models.CharField(max_length=22, choices=STATUS_CHOICES) #stage that the placement/todo is on
    description = models.TextField(null=True, blank=True) #description that the placement/todo has is added to the notification object too (optional)
    shown = models.BooleanField(default=False) #has the notification been shown as a pop up, false at first
    read = models.BooleanField(default=False) #has the notification been read within the notification tab, false at first
    created = models.DateTimeField(auto_now_add=True) #time the notification was created, added automatically using the exact time it was made
    emailed = models.BooleanField(default=False) # has the notification been emailed to the user, false at first
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE) #link notification to user
    placement = models.ForeignKey(Placement, on_delete=models.CASCADE, null=True, blank=True) #link notification to placement when necessary
    todo = models.ForeignKey(ToDo, on_delete=models.CASCADE, null=True, blank=True) #link notification to todo when necessary