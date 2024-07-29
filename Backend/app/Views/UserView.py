from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import APIView
from django.shortcuts import get_object_or_404
from app.serializers.userSerializer import  UserSerializer,UpdateUserSerializer
from app.models import User
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.hashers import check_password




# has been tested successfully

class signUpView(APIView):
    serializer_class=UserSerializer

    def post(self, request=Request):
        data=request.data
        serializer=self.serializer_class(data=data)
        try:

            if serializer.is_valid():
                serializer.save()
                response={"message":"user was created successfully","data":serializer.data}
                return Response(data=response,status=status.HTTP_201_CREATED)
            return Response(data=serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            response = {"error": "An unexpected error occurred", "details": str(e)}
            return Response(data=response, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
            



# has been tested successfully

class updateUserInfo(APIView):
    permission_classes=[IsAuthenticated]
    serializer_class =UpdateUserSerializer
    def patch(self, request:Request):
        user=request.user
        new_data=request.data
        serializer=self.serializer_class(instance=user, data=new_data)

        try:
            if serializer.is_valid():
                serializer.save()
                response={'message':'the profile data has been updated successfully', 'data':serializer.data}
                return Response(data=response, status=status.HTTP_200_OK)
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            response = {"error": "An unexpected error occurred", "details": str(e)}
            return Response(data=response, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
            



# has been tested successfully

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request:Request):
            user = request.user
            old_password = request.data.get('old_password')
            new_password = request.data.get('new_password')
            try:
                if check_password(old_password, user.password):
                    if len(new_password)>=8:
                        user.set_password(new_password)
                        user.save()
                        return Response({'message': 'Password changed successfully'})
                    return Response({'message':'the new password need to be more than 8 characters'},status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({'detail': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                response = {"error": "An unexpected error occurred", "details": str(e)}
                return Response(data=response, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 


