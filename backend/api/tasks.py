from celery import shared_task #imports shared_task that marks the function as a celery task
from django.core.mail import send_mail #import inbuilt django function for sending emails
from django.conf import settings #import django settings for accesing email configurations like 'DEFAULT_FROM_EMAIL'
from .models import Notifications, CustomUser, UserPreferences #import the relevant models used

@shared_task #to mark the function as a Celery task so it can run asynchronously 
def send_scheduled_notifications(): 
    users = CustomUser.objects.all() #fetch all users
    for user in users: #for every user fetched
        user_preferences = UserPreferences.objects.get(user=user) #get the user's preferences
        if not user_preferences.email_notification_enabled: #if email notifications are not enabled
            continue #skip to the next user

            """Query the notifications of the user where the notifications havent been emailed, 
                the days field is greater than or equal to 0 
                and less than or equeal to the user preferences' time field value"""
        
        notifications = Notifications.objects.filter( 
            user=user, 
            emailed=False,
            days__gte=0, #days greater than or equal to
            days__lte=user_preferences.notification_time #days less than or equal to
        )

        if not notifications.exists():  #if no notifications have been returned, 
            continue #skip to the next user

        subject = "Career Compass - Upcoming Deadlines" #define the subject for the email
        message = f"Hello {user.first_name},\n\nYou have the following upcoming deadlines:\n" #the actual message for the email

        for notif in notifications: #for every notification within the notifications retrieved using the filtered query
            message += f"- {notif.company} ({notif.role}) in {notif.days} days.\n" #add to the message the company, role and in how many days the deadline is due

        message += "\nBest regards,\nCareer Compass Team" #finish off the message

        send_mail( #the actual function to send the email
            subject, #use the subject variable to define the subject of the email
            message, #use the message variable to define the message of the email
            settings.DEFAULT_FROM_EMAIL, #who the email is from is fetched from the settings file
            [user.email], #who the eamil is to is the user's email
            fail_silently=False, #if the email fails to send, raise an error
        )

        notifications.update(emailed=True) #update all the notifications queried so their emailed value is true

    return "Email notifications sent successfully." #returns the string within the terminal running the redis command (SEE README -- BACKEND CONFIGURATION SECTION)

