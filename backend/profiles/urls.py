from django.urls import path
from .views import ProfileDetailView
#   from .views import profile_list

urlpatterns = [
    #   path("profiles/", views.profile_list, name="profile-list"),
    path('profile/<int:pk>/', ProfileDetailView.as_view(), name='profile-detail'),
]