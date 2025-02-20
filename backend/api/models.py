from django.db import models
from django.contrib.auth.models import AbstractUser

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

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email

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