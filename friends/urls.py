from django.urls import path
from .views import *

app_name = 'friends'

urlpatterns = [
     path('friend/search/', friend_search, name='friend_search'),
     path('friend/request/<int:receiver_id>/', send_friend_request, name='send_friend_request'),
     path('friend/accept/<int:request_id>/', accept_friend_request, name='accept_friend_request'),
     path('friend/reject/<int:request_id>/', reject_friend_request, name='reject_friend_request'),
     path('friend/list/', friend_list, name='friend_list'),
     path('friend/notifications/', received_notifications, name='received_notifications'),
     path('profile/<int:user_id>/', other_profile, name='other_profile'),
]