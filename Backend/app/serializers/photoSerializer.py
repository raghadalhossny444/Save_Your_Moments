from rest_framework import serializers
from app.models import  Photo




class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ['id', 'album', 'user', 'photo', 'caption', 'date_of_uploading']

        extra_kwargs = {
            'caption': {'required': False},
            'photo':{'required': False}
        }
        read_only_fields = ['date_of_uploading']


