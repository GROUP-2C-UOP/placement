from django.urls import path
from . import views

urlpatterns = [
    path("placements/", views.PlacementListCreate.as_view(), name="placement-list"),
    path("placements/delete/<int:pk>/", views.PlacementDelete.as_view(), name="placement-delete"),
    
]
