from django.http import JsonResponse


def analyze_student(request):
    result = {
        'performance': 'Excellent',
        'score': 92,
        'prediction': 'Top Performer'
    }

    return JsonResponse(result)