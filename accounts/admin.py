from django.contrib import admin
from .models import *
from friends.models import Friend


admin.site.register(Profile)
admin.site.register(TimeHistory)
admin.site.register(Friend)