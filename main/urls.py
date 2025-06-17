from django.urls import path
from .views import *

app_name = 'main'

urlpatterns = [
    path('', mainpage, name='mainpage'),
    path('home/', home, name = 'home'),
    path('edit_profile/', edit_profile, name='edit_profile'),
    path('time_history/', time_history, name='time_history'),
    path('my_posts/', my_posts, name='my_posts'),
    path('saved_posts/', saved_posts, name='saved_posts'),
    # path('friend_list/', friend_list, name='friend_list'),
]
