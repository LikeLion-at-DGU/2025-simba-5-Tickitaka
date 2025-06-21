from django.contrib.auth.models import User
from django.db import models
from main.models import University
from django.dispatch import receiver
from django.db.models.signals import post_save


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    nickname = models.CharField(max_length=30, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    time_balance = models.IntegerField(default=0)
    time_tip = models.IntegerField(default=0)
    followings = models.TextField(blank=True, null=True)
    university = models.ForeignKey(University, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=20, blank=True, null=True)
    image = models.ImageField(upload_to="prof_img/", blank=True, null=True)
    available_time = models.IntegerField(default=0)  # 임시 예약 시간

    def __str__(self):
        return self.nickname if self.nickname else self.name


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        profile = Profile.objects.create(user=instance)

        # 회원가입 선물 30분 지급
        profile.time_balance = 30
        profile.save()

        # 선물 30분 지급 기록 TimeHistory 생성
        TimeHistory.objects.create(
            user=profile,
            amounts=30,
            type='plus',
            # 가입 선물은 post_id는 null임
        )



@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


class TimeHistory(models.Model):
    TRANSACTION_TYPES = [
        ('plus', '플러스'),
        ('minus', '마이너스'),
        ('tip', '팁'),
    ]

    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    amounts = models.IntegerField()
    type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    timestamp = models.DateTimeField(auto_now_add=True)
    post = models.ForeignKey('posts.Post', on_delete=models.SET_NULL, null=True, blank=True)



