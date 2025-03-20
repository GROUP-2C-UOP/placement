from django.urls import path
from . import views

urlpatterns = [
    path("placements/", views.PlacementListCreate.as_view(), name="placement-list"),
    path("placements/delete/<int:pk>/", views.PlacementDelete.as_view(), name="placement-delete"),
    path("placements/update/<int:pk>/", views.PlacementUpdate.as_view(), name="placement-update"),
    path("todos/", views.ToDoListCreate.as_view(), name="todo-list"),
    path("todos/delete/<int:pk>/", views.ToDoDelete.as_view(), name="todo-delete"),
    path("todos/update/<int:pk>/", views.ToDoUpdate.as_view(), name="todo-update"),
    path("notifications/", views.NotificationListCreate.as_view(), name="notification-list"),
    path("notifications/delete/<int:pk>/", views.NotificationDelete.as_view(), name="notification-delete"),
    path("notifications/bulkupdate/", views.NotificationBulkUpdate.as_view(), name="notifications-bulk-update"),
    path("notifications/update/<int:pk>/", views.NotificationUpdate.as_view(), name="notification-update"),
    path("account/details/", views.GetUserDetails.as_view(), name="get-details"),
    path("account/picture/", views.GetProfilePicture.as_view(), name="get-picture"),
    path("account/name/", views.GetUserName.as_view(), name="user-name"),
    path("account/email/", views.GetEmail.as_view(), name="get-email"),
    path("account/password/update/", views.PasswordUpdate.as_view(), name="update-password"),
    path("account/update/", views.UserUpdate.as_view(), name="update-details"),
    path("account/notification/status/", views.GetNotificationStatus.as_view(), name="get-status"),
    path("account/notification/time/", views.GetNotificationTime.as_view(), name="get-time"),
    path("account/notification/update/", views.NotificationSettingsUpdate.as_view(), name="update-notification-settings")
]