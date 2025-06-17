# chat/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('chat_room/', views.chat_room, name='chat_room'),
]
