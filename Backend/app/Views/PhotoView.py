from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from app.models import Album, Photo
from app.serializers.photoSerializer import PhotoSerializer
from app.tasks import generate_caption
from rest_framework.permissions import IsAuthenticated

class PhotoUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, format=None):
        user = request.user
        responses = []
        use_llm = request.data.get('use_llm_vision',False)
        lang = request.data.get('lang','en')
        strategy = 'pipeline'
        if use_llm == 'true':
            strategy = 'llm'
        print("Strategy = ",strategy)
        # Iterate over the files in the request
        for key in request.FILES:
            photo_file = request.FILES[key]
            data = {
                'user': user.id,
                'album': request.data.get('album'),
                'photo': photo_file,
                'caption': request.data.get('caption'),  # Optional caption
                'caption_strategy': strategy
            }

            serializer = PhotoSerializer(data=data)
            if serializer.is_valid():
                photo_instance = serializer.save()
                # Schedule the caption generation task if needed
                generate_caption.delay(photo_instance.id,strategy,lang)
                responses.append(serializer.data)
            else:
                # Return the first error encountered
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Photos uploaded successfully", "data": responses}, status=status.HTTP_201_CREATED)


# Polling Mechanism: The frontend periodically checks the status of the caption generation by polling the backend.

class PhotoStatusView(APIView):
    permission_classes=[IsAuthenticated]


    def get(self, request, photo_id):
        photo = get_object_or_404(Photo, id=photo_id)
        serializer = PhotoSerializer(photo)
        return Response(serializer.data, status=status.HTTP_200_OK)
    



class photo_CRUD(APIView):

    permission_classes = [IsAuthenticated]
    serializer_class=PhotoSerializer

    def get(self, request: Request, pk:int):
        try:
            photo=get_object_or_404(Photo, pk=pk)
            serializer = self.serializer_class(photo)
            response={'message':'the photo of the id you provide','data':serializer.data}
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            response = {"error": "An unexpected error occurred", "details": str(e)}
            return Response(data=response, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
    

    def delete(self,request: Request, pk:int):
        try:
            photo=get_object_or_404(Photo, pk=pk)
            photo.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            response = {"error": "An unexpected error occurred", "details": str(e)}
            return Response(data=response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

# edit the caption.
    def patch(self,request: Request, pk:int):
        try: 
            data=request.data
            photo=get_object_or_404(Photo, pk=pk)
            serializer=self.serializer_class(instance=photo, data=data)
            if serializer.is_valid():
                serializer.save()
                response={"message":"album data has edited  successfully",'data':serializer.data}
                return Response(data=response, status=status.HTTP_200_OK)
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            response = {"error": "An unexpected error occurred", "details": str(e)}
            return Response(data=response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# photos list
class PhotoListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # get album id from query parameters
        album = request.query_params.get('album',None)
        if album:
            album = get_object_or_404(Album, pk=int(album))
        photos = Photo.objects.filter(user=user,album=album)
        serializer = PhotoSerializer(photos, many=True)
        return Response(serializer.data)