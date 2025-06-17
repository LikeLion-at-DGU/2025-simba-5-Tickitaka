# chat/urls.py
from django.urls import path
from .views import *

urlpatterns = [
    path('chat_room/', chat_room, name='chat_room'),
]
