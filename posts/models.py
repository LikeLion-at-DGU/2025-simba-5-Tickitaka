from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Post(models.Model):
     title = models.CharField(max_length=200)
     # content = models.TextField()
     # # 미디어 설정 필요
     # #image = models.ImageField(upload_to='post_images/', blank=True, null=True)
     # location = models.CharField(max_length=100) 
     # tickit = models.IntegerField(help_text="5분 단위, 예: 5, 10, 15, ...")
     # deadline = models.DateTimeField()

     # master = models.ForeignKey(User, on_delete=models.CASCADE, related_name='master_posts')
     # helper = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='helper_posts')

     # STATUS_CHOICES = [
     #      ('WAITING', '헬퍼 찾는 중'),
     #      ('Chatting', '채팅 중'),
     #      ('IN_PROGRESS', '진행 중'),
     #      ('DONE', '거래 완료'),
     # ]
     # status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='WAITING')
     # created_at = models.DateTimeField(auto_now_add=True)
     # save = models.ManyToManyField()

     # def __str__(self):
     #      return f"{self.title} ({self.status})"