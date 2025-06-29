from django.urls import path
from .views import *

app_name = 'posts'

urlpatterns = [
    path('post_list/', post_list, name='post_list'),
    path('post_detail/<int:id>', post_detail, name='post_detail'),
    path('post_create/', post_create, name='post_create'),
    path('post_update/<int:id>', post_update, name='post_update'),
    path('post_delete/<int:id>', post_delete, name='post_delete'),  
    path('<int:post_id>/saved/', toggle_saved, name='toggle_saved'),
    path('<int:post_id>/call/', call_post, name='call_post'),
    path('post_edit/<int:id>', post_edit, name='post_edit'), 
]
