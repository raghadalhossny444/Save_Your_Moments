from rest_framework import serializers
from app.models import Album, Photo


class AlbumsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Album
        fields = ['id', 'user', 'name', 'date_of_creation', 'cover_photo']  # Updated
        extra_kwargs = {
            'id': {'required': False}
        }

    def validate_name(self, value):
        if not value[0].isalpha():
            raise serializers.ValidationError("The name must start with a letter.")
        if len(value) > 20:
            raise serializers.ValidationError("The name must not exceed 20 characters.")
        return value
    


class PhotoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Photo
        fields = ['id', 'image', 'description', 'date_of_uploading']



class oneAlbumSerializer(serializers.ModelSerializer):
    photos = PhotoSerializer(many=True, read_only=True)
    

    class Meta:
        model = Album
        fields = ['id', 'user', 'name', 'date_of_creation', 'photos', 'cover_photo']  # Updated
        extra_kwargs = {
            'user': {'required': False}
        }


