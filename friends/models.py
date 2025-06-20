from django.db import models
from accounts.models import Profile

class Friend(models.Model):
    requester = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='sent_friend_requests')
    receiver = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='received_friend_requests')
    status = models.CharField(max_length=10, choices=[
        ('pending', '수락대기중'),
        ('accepted', '수락됨'),
    ])

