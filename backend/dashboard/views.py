from django.http import JsonResponse


def dashboard_home(request):
    data = {
        'students': 120,
        'reports': 40,
        'analysis': 85,
    }

    return JsonResponse(data)