from django.urls import path
from . import views

urlpatterns = [
    path("placements/", views.PlacementListCreate.as_view(), name="placement-list"),
    path("placements/delete/<int:pk>/", views.PlacementDelete.as_view(), name="placement-delete"),
    path("placements/update/<int:pk>/", views.PlacementUpdate.as_view(), name="placement-update"),
    path("user/getname/", views.GetUserName.as_view(), name="user-name")
]
