from django.urls import path
from .views import *

app_name = 'posts'

urlpatterns = [
    path('post_list', post_list, name='post_list'),
]
