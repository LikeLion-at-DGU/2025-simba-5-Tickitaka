from django.urls import path
from . import views
from .views import signup, login_view, logout_view

app_name = 'accounts'


urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('signup2/', views.signup2, name='signup2'), 
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('check_nickname/', views.check_nickname, name='check_nickname'),
    path('check_username/', views.check_username, name='check_username'),
]

