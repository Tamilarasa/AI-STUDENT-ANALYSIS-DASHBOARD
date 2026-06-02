from django.http import JsonResponse
from .models import StudentFile


def upload_file(request):
    if request.method == 'POST':
        uploaded_file = request.FILES.get('file')

        if uploaded_file:
            StudentFile.objects.create(
                title=uploaded_file.name,
                file=uploaded_file
            )

            return JsonResponse({'message': 'File Uploaded Successfully'})

    return JsonResponse({'error': 'Upload Failed'})