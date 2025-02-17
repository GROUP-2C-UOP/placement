from django.conf import settings
from django.db import models
from django.contrib.auth.models import User
from api.models import Placement


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE) 
    location = models.CharField(max_length=100, blank=True) 
    application_count = Placement.objects.count() # THIS IS ONLY DISPLAYING THE PLACEMENT COUNT -> 
                                                  # ADD A STRING MESSAGE IN FRONTEND DESCRIBING WHAT COUNT DOES
    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True) 

    def __str__(self):
        return f"{self.user.username}'s Profile"
