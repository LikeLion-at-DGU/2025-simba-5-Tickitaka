from django.urls import path, include
from .views import *

app_name = 'friends'

urlpatterns = [
     path('search/', friend_search, name='friend_search'),
     path('request/<int:receiver_id>/', send_friend_request, name='send_friend_request'),
     path('accept/<int:request_id>/', accept_friend_request, name='accept_friend_request'),
     path('reject/<int:request_id>/', reject_friend_request, name='reject_friend_request'),
     path('list/', friend_list, name='friend_list'),
     path('alarm/', friend_alarm, name='friend_alarm'),
     path('profile/<int:user_id>/', other_profile, name='other_profile'),
]

