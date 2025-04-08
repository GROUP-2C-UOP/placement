from django.db import models #imports django's orm models
from django.contrib.auth.models import AbstractUser #imports django's customisable user model
from django.db.models.signals import post_save #imports singal to trigger functions after a model's save
from django.dispatch import receiver #imports reciever to handle signals
from datetime import timedelta #imports timedelta to calulate time-based values
from django.utils import timezone #imports timezone to retrieve the current time

#status choices for placements and notifications
# format: (database_value, human_readable_value)
STATUS_CHOICES = [ 
    ('applied', 'Applied'),
    ('phone_interview', 'Phone Interview'),
    ('face_to_face_interview', 'Face to Face Interview'),
    ('assessment', 'Assessment'),
    ('rejected', 'Rejected'),
    ('offer_made', 'Offer Made'),
    ('withdrawn', 'Withdrawn'),
]


class CustomUser(AbstractUser):
    """
    Custom User Model constructed from Django's AbstratUser -- seen from the parameter.
    Uses email as the username fields

    Attributes:
        email (EmailField): unique email address as username
        profile_picture (ImageField): optional profile picture
    
    Inherits all fields from Django's AbstractUser while customizing:
        - USERNAME_FIELD set to 'email'
        - Makes first_name and last_name required
    """
    email = models.EmailField(unique=True)  #unique is flagged as true so that there arent duplicate usernames
    profile_picture = models.ImageField(upload_to="profiles/", null=True, blank=True) #profile pictures can be set later so they can be null and blank on creation. uploaded images will be stored within the profiles directory within the media directory

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name'] 
    

    
def default_valid_until(): #function to calculate when verification codes expire (5 minutes from now)
    return timezone.now() + timedelta(minutes=5) 


class UserVerification(models.Model):
    """
    Model for storing verification codes, the emails associated to the codes and the expiration times.

    Attributes:
        email (EmailField): email address to verify
        code (CharField): 6-digit verification code
        created_at (DateTimeField): when code was generated (auto-set)
        valid_until (DateTimeField): when code expires (auto-calculated using function above)
    """

    email = models.EmailField(unique=True) 
    code = models.CharField(max_length=6) 
    created_at = models.DateTimeField(auto_now_add=True) 
    valid_until = models.DateTimeField(default=default_valid_until) 
    

class UserPreferences(models.Model): 
    """
    Model for storing notification preferences of each user.

    Attributes:
        notification_enabled (BooleanField): enable in-app notifications
        email_notification_enabled (BooleanField): enable email notifications
        notification_time (IntegerField): days before deadline to notify
        user (ForeignKey): reference to associated CustomUser
    """
    notification_enabled = models.BooleanField(default=True) 
    email_notification_enabled = models.BooleanField(default=True) 
    notification_time = models.IntegerField(default=3) 
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE) 

@receiver(post_save, sender=CustomUser) 
def create_user_preferences(sender, instance, created, **kwargs):
    """
     @reciever <----- Signal handler to create UserPreferences when new user is created.
    
    Args:
        sender: the CustomUser model class
        instance: the actual CustomUser instance being saved
        created (bool): whether this is a new user creation
    """
    if created: # if user is newly created
        UserPreferences.objects.create(user=instance) #create user preferences model which is linked to newly created custom user

class Placement(models.Model):
    """
    Model for an individual placement

    Attributes:
        company (CharField): company name (max 100 characters)
        role (CharField): job role (max 100 characters)
        salary (FloatField): optional offered salary
        starting_date (DateField): optional start date
        duration (IntegerField): optional duration in months
        next_stage_deadline (DateField): optional deadline of a status (e.g. assessment due 01/01/01)
        placement_link (URLField): optional link to job posting
        date_applied (DateField): when placement was applied for
        status (CharField): optional current hiring stage from STATUS_CHOICES 
        cv (FileField): optional uploaded resume ---> uploads to resumes within the media directory
        cover_letter (FileField): optional uploaded cover letter ---> uploads to coverletters within the media directory 
        contact (CharField): optional contact info (max 150 chars) ---> is charfield to allow flexibility for what user wants to input (e.g email/number or something else)
        description (TextField): optional notes about application
        user (ForeignKey): Associated user account
    """
    company = models.CharField(max_length=100) 
    role = models.CharField(max_length=100) 
    salary = models.FloatField(null=True) 
    starting_date = models.DateField(null=True)
    duration = models.IntegerField(null=True) 
    next_stage_deadline = models.DateField(null=True) 
    placement_link = models.URLField(null=True) 
    date_applied = models.DateField() 
    status = models.CharField(max_length=22, choices=STATUS_CHOICES, null=True, blank=True)
    cv = models.FileField(upload_to='resumes/', null=True, blank=True) 
    cover_letter = models.FileField(upload_to='cover_letters/', null=True, blank=True) 
    contact = models.CharField(max_length=150, null=True) 
    description = models.TextField(null=True, blank=True) 
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE) 
    
class ToDo(models.Model): 
    """
    Model to track individual applications a user wants to complete

    Attributes:
    Exactly same as placement with some missing
    """
    company = models.CharField(max_length=100) 
    role = models.CharField(max_length=100) 
    salary = models.FloatField(null=True) 
    starting_date = models.DateField(null=True)
    duration = models.IntegerField(null=True) 
    next_stage_deadline = models.DateField(null=True) #deadline for application. called next_stage_deadline because forgot to change it oops <---- dont do this!!!!
    placement_link = models.URLField(null=True) #url link to placement listing (optional) 
    description = models.TextField(null=True, blank=True) 
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE) 

class Notifications(models.Model): #notification model for users
    """
    Model for notifications about deadlines and updates

    Attributes:
    Consistent with Placement and ToDo Model
    shown (BooleanField): if notification was displayed within the website itself (defaults as false)
    read (BooleanField): if notification was viewed within the notification tab (defaults as false)
    emailed (BooleanField): if email for notification was sent (defaults as false)
    created (DateTimeField): when notification was generated
    user (ForeignKey): recipient user
    placement (ForeignKey): optional linked Placement
    todo (ForeignKey): optional linked ToDo item
    """
    company = models.CharField(max_length=100) 
    role = models.CharField(max_length=100) 
    days = models.IntegerField() 
    status = models.CharField(max_length=22, choices=STATUS_CHOICES) 
    description = models.TextField(null=True, blank=True)
    shown = models.BooleanField(default=False) 
    read = models.BooleanField(default=False) 
    created = models.DateTimeField(auto_now_add=True) 
    emailed = models.BooleanField(default=False) 
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE) 
    placement = models.ForeignKey(Placement, on_delete=models.CASCADE, null=True, blank=True) 
    todo = models.ForeignKey(ToDo, on_delete=models.CASCADE, null=True, blank=True) 