from django.db import models
from accounts.models import Profile

class Friend(models.Model):
    requester = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='sent_friend_requests')
    receiver = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='received_friend_requests')
    status = models.CharField(max_length=10, choices=[
        ('pending', '수락대기중'),
        ('accepted', '수락됨'),
    ])

    def __str__(self):
        return f"{self.requester} -> {self.receiver} ({self.status})"


class FriendRequestNotification(models.Model):
    sender = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='sent_notifications')
    receiver = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='friend_alarm')
    friend_request = models.ForeignKey(Friend, on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} -> {self.receiver} 친구요청 알림"

