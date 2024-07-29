from rest_framework import serializers
from app.models import User



#this serializer is for SIGN UP.
class UserSerializer(serializers.ModelSerializer):
    #some validations:
    email=serializers.CharField(max_length=60)
    password=serializers.CharField(min_length=8,write_only=True)
    class Meta:
        model=User
        fields=['email','password','user_name','profile_photo']


    def create(self, validated_data):
        email = validated_data.get('email')
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError('Email already exists.')
        
        password = validated_data.pop("password")
        user = super().create(validated_data)
        user.set_password(password)
        user.save()
        return user


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_name', 'profile_photo']
        extra_kwargs = {
            'user_name': {'required': False},
            'profile_photo': {'required': False}
        }

    def update(self, instance, validated_data):
        instance.user_name = validated_data.get('user_name', instance.user_name)
        instance.profile_photo = validated_data.get('profile_photo', instance.profile_photo)
        instance.save()
        return instance