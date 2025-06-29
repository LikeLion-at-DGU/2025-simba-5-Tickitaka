from django.urls import path
from .views import *

app_name = 'chats'

urlpatterns = [
    path('list/', chat_list, name='chat_list'),
    path('<int:room_id>/', chat_room, name='chat_room'),
    path('<int:room_id>/send/', submit_chat, name='submit_chat'),
    path('<int:room_id>/cancel_transaction/', cancel_transaction, name='cancel_transaction'),
    path('<int:room_id>/start_transaction/', start_transaction, name='start_transaction'),
    path('<int:room_id>/approve_finish/', approve_finish, name='approve_finish'),
    path('<int:room_id>/fetch/', fetch_chats, name='fetch_chats'),
    path('<int:room_id>/request_finish/', request_finish, name='request_finish'),
    path('review/<int:post_id>/', process_review, name='review'),
    path('<int:room_id>/reject_finish/', reject_finish, name='reject_finish'),
]
