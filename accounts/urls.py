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
    path('send_verification_code/', views.send_verification_code, name='send_verification_code'),
    path('verify_code/', views.verify_code, name='verify_code'),
    path('api/university-domains/', views.get_university_domains, name='university_domains'),
]

