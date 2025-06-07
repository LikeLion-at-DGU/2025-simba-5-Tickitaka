from django.urls import path
from .views import *

app_name = 'accounts'


urlpatterns = [
    path('signup/', signup, name='signup'),
    path('signup2/', signup2, name='signup2'), 
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('check_nickname/', check_nickname, name='check_nickname'),
    path('check_username/', check_username, name='check_username'),
    path('send_verification_code/', send_verification_code, name='send_verification_code'),
    path('verify_code/', verify_code, name='verify_code'),
    path('api/university-domains/', get_university_domains, name='university_domains'),
]

