from django.contrib import admin
from app import models


admin.site.register(models.User)
admin.site.register(models.Photo)
admin.site.register(models.Album)





