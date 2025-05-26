from django.contrib.auth.models import User
from django.db import models
from main.models import University
from django.dispatch import receiver
from django.db.models.signals import post_save


class Profile(models.Model):
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    nickname = models.CharField(max_length=30, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    time_balance = models.IntegerField(default=0)
    time_tip = models.IntegerField(default=0)
    followings = models.TextField(blank=True, null=True)
    university = models.ForeignKey(University, on_delete=models.CASCADE)
    name = models.CharField(max_length=20, blank=True, null=True)
    

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

    def __str__(self):
        return self.username


class TimeHistory(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    amounts = models.IntegerField()
    type = models.CharField(max_length=10, choices=[('plus', '플러스'), ('minus', '마이너스')])
    timestamp = models.DateTimeField(auto_now_add=True)
    post_id = models.IntegerField()

class Friend(models.Model):
    requester = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='sent_requests')
    receiver = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='received_requests')
    status = models.CharField(max_length=10, choices=[('pending', '수락대기중'), ('accepted', '수락됨')])