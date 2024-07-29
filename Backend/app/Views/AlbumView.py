from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import APIView
from django.shortcuts import get_object_or_404
from app.serializers.albumSerializer import  *
from app.models import Album , User
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.exceptions import NotFound




# has been tested successfully

# this end point is for geting all the albums for one user.
class AlbumListView(APIView):

    permission_classes = [IsAuthenticated]
    serializer_class=AlbumsSerializer

    def get(self, request: Request):
        try:
            user = request.user
            albums = Album.objects.filter(user=user)
            serializer = self.serializer_class(albums, many=True)
            response={'message':'the albums for one user', 'data':serializer.data}
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            response = {"error": "An unexpected error occurred", "details": str(e)}
            return Response(data=response, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
            


# has been tested successfully
#  this end point is for add/delete/edit a single album.
class Album_CRUD(APIView):

    permission_classes = [IsAuthenticated]
    serializer_class=oneAlbumSerializer

    def get(self, request: Request, pk:int):
        try:
            album=get_object_or_404(Album, pk=pk)
            serializer = self.serializer_class(album)
            response={'message':'one album photos and informations','data':serializer.data}
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            response = {"error": "An unexpected error occurred", "details": str(e)}
            return Response(data=response, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
    

    def delete(self,request: Request, pk:int):
        try:
            album=get_object_or_404(Album, pk=pk)
            album.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            response = {"error": "An unexpected error occurred", "details": str(e)}
            return Response(data=response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

    def patch(self,request: Request, pk:int):
        try: 
            data=request.data
            album=get_object_or_404(Album, pk=pk)
            serializer=self.serializer_class(instance=album, data=data)
            if serializer.is_valid():
                serializer.save()
                response={"message":"album data has edited  successfully",'data':serializer.data}
                return Response(data=response, status=status.HTTP_200_OK)
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            response = {"error": "An unexpected error occurred", "details": str(e)}
            return Response(data=response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# has been tested successfully
# this end point is to create a single album.
class album_creation(APIView):
    permission_classes=[IsAuthenticated]
    serializer_class=AlbumsSerializer

    def post(self, request: Request):
        data = request.data
        data['user'] = request.user.id
        serializer = self.serializer_class(data=data)
        try:
            if serializer.is_valid():
                serializer.save()
                response = {"message": "Adding new album successfully", "data": serializer.data}
                return Response(data=response, status=status.HTTP_201_CREATED)
            else:
                return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            response = {"error": "Validation error", "details": str(e)}
            return Response(data=response, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            response = {"error": "An unexpected error occurred", "details": str(e)}
            return Response(data=response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
