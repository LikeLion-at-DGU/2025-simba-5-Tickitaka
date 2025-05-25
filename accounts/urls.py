from django.urls import path
from . import views
from .views import signup, login_view, logout_view

app_name = 'accounts'

urlpatterns = [
    path('signup2/', views.signup2, name='signup2'), 
    path('signup/', views.signup, name='signup'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('check_nickname/', views.check_nickname, name='check_nickname'),
]

