from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser


class AccountManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        account = self.model(email=email, **extra_fields)
        account.set_password(password)
        account.save(using=self._db)
        return account

    def create_superuser(self, email, password=None, **extra_fields):
        account = self.create_user(email, password, **extra_fields)
        account.is_staff = True
        account.is_superuser = True
        account.save()
        return account


class User(AbstractBaseUser):
    
    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True, max_length=60)
    password = models.CharField(max_length=128)
    user_name = models.CharField(unique=True,max_length=50)
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True, default='profile_photos/user_default_photo.jpg')


    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['user_name']
    objects = AccountManager()
    def __str__(self):
        return self.email
    def has_perm(self, perm, obj=None):
        return self.is_superuser
    def has_module_perms(self, app_label):
        return self.is_superuser


# models.py
class Album(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='albums')
    name = models.CharField(max_length=100)
    date_of_creation = models.DateTimeField(auto_now_add=True)
    cover_photo = models.ImageField(upload_to='album_covers/', blank=True, null=True)  # New field

    def __str__(self):
        return self.name



class Photo(models.Model):

    id = models.AutoField(primary_key=True)
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='photos')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='photos')
    photo = models.ImageField(upload_to='photos/')
    caption = models.TextField(blank=True, null=True)
    caption_strategy = models.TextField(blank=True, null=True)
    date_of_uploading = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Photo in album {self.album.name} with caption '{self.caption}'"
    def delete(self, *args, **kwargs):
        # Delete the file from the filesystem
        self.photo.delete(save=False)
        # Call the superclass delete method to remove the object from the database
        super().delete(*args, **kwargs)