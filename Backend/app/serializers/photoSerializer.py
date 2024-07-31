from rest_framework import serializers
from app.models import  Photo




from rest_framework import serializers
from app.models import Photo

class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ['id', 'album', 'user', 'photo', 'caption','caption_strategy', 'date_of_uploading']
        extra_kwargs = {
            'caption': {'required': False},
            'caption_strategy': {'required': False},
            'photo': {'required': True}
        }
        read_only_fields = ['date_of_uploading']

