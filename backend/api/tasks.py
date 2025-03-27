from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from datetime import date
from .models import Notifications, CustomUser

@shared_task
def send_scheduled_notifications():
    users = CustomUser.objects.all()
    for user in users:
        notifications = Notifications.objects.filter(user=user, shown=False)

        if notifications.exists():
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

            # Mark notifications as shown
            notifications.update(shown=True)

    return "Email notifications sent."

