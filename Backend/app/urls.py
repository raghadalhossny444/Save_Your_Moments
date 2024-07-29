from django.urls import path
from app.Views import view

urlpatterns = [
    path('sign-up',view.signUpView.as_view(),name='signUp'),
]