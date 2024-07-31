from django.urls import path
from app.Views import AlbumView, UserView, PhotoView

urlpatterns = [

    # users endpoints
    path('sign-up',UserView.signUpView.as_view(),name='signUp'),
    path('user-password', UserView.ChangePasswordView.as_view(), name='change-user-password'),
    path('user-profile',UserView.updateUserInfo.as_view(),name='update-profile-info'),


    # album endpoints
    path('albums/',AlbumView.AlbumListCreateView.as_view(), name='album_list_create'),
    path('albums/<int:pk>',AlbumView.Album_CRUD.as_view(),name='one_album_CRUD'),

    # photos endpoints
    path('photos/upload/', PhotoView.PhotoUploadView.as_view(), name='photo_upload'),
    path('photos/status/<int:photo_id>/', PhotoView.PhotoStatusView.as_view(), name='photo_status'),
    path('photos/<int:pk>/',PhotoView.photo_CRUD.as_view(),name='photo_info_edit'),
    path('photos/',PhotoView.PhotoListView.as_view(), name='photo_list'),


]



# you can replace it latter with Doker.
# Make sure to start the Celery worker in a terminal
# celery -A myproject worker --loglevel=info
