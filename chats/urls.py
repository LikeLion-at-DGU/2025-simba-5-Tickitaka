from django.urls import path
from . import views

app_name = 'chat'

urlpatterns = [
    path('', views.chat_list, name='chat_list'),
    path('<int:room_id>/', views.chat_room, name='chat_room'),
    path('<int:room_id>/send/', views.submit_chat, name='submit_chat'),
    path('<int:room_id>/fetch/', views.fetch_chats, name='fetch_chats'),
]

