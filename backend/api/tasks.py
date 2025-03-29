from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from datetime import date
from .models import Notifications, CustomUser, UserPreferences

@shared_task
def send_scheduled_notifications():
    users = CustomUser.objects.all()
    for user in users:
        user_preferences = UserPreferences.objects.get(user=user)
        if not user_preferences.email_notification_enabled:
            continue

        notifications = Notifications.objects.filter(
            user=user, 
            emailed=False,
            days__gte=0, #days greater than or equal to
            days__lte=user_preferences.notification_time #days less than or equal to
        )

        if not notifications.exists():  
            continue

        subject = "Career Compass - Upcoming Deadlines"
        message = f"Hello {user.first_name},\n\nYou have the following upcoming deadlines:\n"

        for notif in notifications:
            message += f"- {notif.company} ({notif.role}) in {notif.days} days.\n"

        message += "\nBest regards,\nCareer Compass Team"

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )

        notifications.update(emailed=True)

    return "Email notifications sent successfully."

