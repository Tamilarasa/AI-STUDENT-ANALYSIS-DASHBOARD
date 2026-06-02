from django.urls import path
from .views import analyze_student

urlpatterns = [
    path('', analyze_student),
]