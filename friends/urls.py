from django.urls import path
from .views import *

app_name = 'friends'

urlpatterns = [
     path('pr   ofile/<int:id>/', other_profile, name='other_profile'),
]
