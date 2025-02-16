from django.urls import path
from .views import ProfileDetailView
from .views import profile_list

urlpatterns = [
    path('profile/<int:pk>/', ProfileDetailView.as_view(), name='profile-detail'),
     path('api/profiles/', profile_list, name='profile-list'),
]