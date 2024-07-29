from django.urls import path
from app.Views import AlbumView, UserView, PhotoView

urlpatterns = [

    # users endpoints
    path('sign-up',UserView.signUpView.as_view(),name='signUp'),
    path('user-password', UserView.ChangePasswordView.as_view(), name='change-user-password'),
    path('user-profile',UserView.updateUserInfo.as_view(),name='update-profile-info'),


    # album endpoints
    path('user-albums/<int:user_id>',AlbumView.AlbumListView.as_view(), name='album_list'),
    path('album-information/<int:pk>',AlbumView.Album_CRUD.as_view(),name='one_album_CRUD'),
    path('album',AlbumView.album_creation.as_view(), name='album_add'),

    # photos endpoints
    path('photo/upload/',PhotoView.PhotoUploadView.as_view(), name='photo_upload'),
    path('photo/status/<int:photo_id>/', PhotoView.PhotoStatusView.as_view(), name='photo_status'),
    path('photo-info/<int:pk>/',PhotoView.photo_CRUD.as_view(),name='photo_info_edit'),


]



# you can replace it latter with Doker.
# Make sure to start the Celery worker in a terminal
# celery -A myproject worker --loglevel=info
