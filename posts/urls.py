from django.urls import path
from .views import *

app_name = 'posts'

urlpatterns = [
    path('post_list', post_list, name='post_list'),
    path('post/<int:id>', post_detail, name='post_detail'),
    path('post_create/', post_create, name='post_create'),
]
