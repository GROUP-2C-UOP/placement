from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.email

class Placement(models.Model):
    company = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    salary = models.FloatField()
    starting_date = models.DateField()
    duration = models.IntegerField()
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.role} at {self.company}"
