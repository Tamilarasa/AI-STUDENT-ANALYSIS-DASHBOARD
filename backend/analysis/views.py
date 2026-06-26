from rest_framework.views import APIView
from rest_framework.response import Response

class DashboardView(APIView):
    def get(self, request):
        return Response({
            "students": 500,
            "attendance": 92,
            "at_risk": 35,
            "insights": 15
        })