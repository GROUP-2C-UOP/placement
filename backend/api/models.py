from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver

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
    email = models.EmailField(unique=True)
    profile_picture = models.ImageField(upload_to="profiles/", null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email
    
class UserPreferences(models.Model):
    notification_enabled = models.BooleanField(default=False)
    notification_time = models.IntegerField(default=3)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return f"Preferences for {self.user.username}"
    
@receiver(post_save, sender=CustomUser) #when a customuser instance is saved in the db the function below runs
def create_user_preferences(sender, instance, created, **kwargs):
    """parameters: 
        sender = custom user that sent signal to trigger function 
        instance = object that was saved, custom user
        created = boolean flag to tell if custom user was created
        """
    if created: # if user is new
        UserPreferences.objects.create(user=instance) #create user preferences model which is linked to newly created custom user

class Placement(models.Model):
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

    def __str__(self):
        return f"{self.role} at {self.company}"


class Notifications(models.Model):
    company = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    days = models.IntegerField()
    status = models.CharField(max_length=22, choices=STATUS_CHOICES)
    description = models.TextField(null=True, blank=True)
    shown = models.BooleanField(default=False)
    read = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    placement= models.ForeignKey(Placement, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.status} for {self.company} in {self.days}"