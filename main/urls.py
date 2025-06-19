from django.urls import path
from .views import *

app_name = 'main'

urlpatterns = [
    path('', mainpage, name='mainpage'),
    path('report/', report, name='report'),
    # path('home/', home, name = 'home'),
    # path('edit_profile/', edit_profile, name='edit_profile'),
    # path('time_history/', time_history, name='time_history'),
    path('my_posts/', my_posts, name='my_posts'),
    path('saved_posts/', saved_posts, name='saved_posts'),
    # path('profile/<int:id>/', other_profile, name='other_profile'),
]
