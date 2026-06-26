from django.urls import path
from .views import DashboardView, LoginView, RegisterView

urlpatterns = [
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
    path("login/", LoginView.as_view(), name="login"),
    path("register/", RegisterView.as_view(), name="register"),
]