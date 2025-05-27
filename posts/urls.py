from django.urls import path
from .views import *

app_name = 'posts'

urlpatterns = [
    path('post_list', post_list, name='post_list'),
<<<<<<< HEAD
    path('post/<int:id>', post_detail, name='post_detail'),
    path('post_create/', post_create, name='post_create'),
=======
    path('post_detail/<int:id>', post_detail, name='post_detail'),
>>>>>>> b3afc6ce76d888db4c2b2eba8755e6dbf4f5eb9c
]
