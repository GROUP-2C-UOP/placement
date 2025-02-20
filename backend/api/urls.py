from django.urls import path
from . import views

urlpatterns = [
    path("placements/", views.PlacementListCreate.as_view(), name="placement-list"),
    path("placements/delete/<int:pk>/", views.PlacementDelete.as_view(), name="placement-delete"),
    path("placements/update/<int:pk>/", views.PlacementUpdate.as_view(), name="placement-update"),
    path("notifications/", views.NotificationListCreate.as_view(), name="notification-list"),
    path("notifications/delete/<int:pk>/", views.NotificationDelete.as_view(), name="notification-delete"),
    path("notifications/bulkupdate/", views.NotificationBulkUpdate.as_view(), name="notifications-bulk-update"),
    path("notifications/update/<int:pk>/", views.NotificationUpdate.as_view(), name="notification-update"),
    path("user/getname/", views.GetUserName.as_view(), name="user-name")
]
