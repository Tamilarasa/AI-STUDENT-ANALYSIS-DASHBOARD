from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class DashboardView(APIView):
    def get(self, request):
        return Response({
            "students": 500,
            "attendance": 92,
            "at_risk": 35,
            "insights": 15
        })


class RegisterView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password required"}, status=400)

        if User.objects.filter(username=email).exists():
            return Response({"error": "User already exists"}, status=400)

        User.objects.create_user(username=email, email=email, password=password)

        return Response({"message": "Registered successfully"}, status=201)


class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(username=email, password=password)

        if user is None:
            return Response({"error": "Invalid email or password"}, status=401)

        return Response({
            "message": "Login successful",
            "email": user.email
        })