from django.urls import path
from app.Views import AlbumView, UserView

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

]