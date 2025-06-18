from django.urls import path
from .views import *

app_name = 'chats'

urlpatterns = [
    path('', chat_list, name='chat_list'),
    path('<int:room_id>/', chat_room, name='chat_room'),
    path('<int:room_id>/send/', submit_chat, name='submit_chat'),
    path('<int:room_id>/fetch/', fetch_chats, name='fetch_chats'),
]
