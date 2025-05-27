from django.db import models
from accounts.models import Profile
from main.models import University, Building

class Post(models.Model):
     title = models.CharField(max_length=100)
     content = models.TextField()
     building = models.ForeignKey(Building, on_delete=models.CASCADE)
     amounts = models.IntegerField()
     deadline = models.DateTimeField()
     status = models.CharField(max_length=20, choices=[
          ('waiting', '헬퍼찾는중'),
          ('chatting', '채팅중'),
          ('in_progress', '거래중'),
          ('done', '거래완료'),
     ])
     saved_count = models.IntegerField(default=0)
     master = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='master_posts')
     helper = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='helper_posts', null=True, blank=True)
     university = models.ForeignKey(University, on_delete=models.CASCADE)
     timestamp = models.DateTimeField(auto_now_add=True)
     burning = models.IntegerField(choices=[(0, 'default'), (1, 'burning')], default=0)
     private_info = models.TextField(blank=True, null=True)

class PostImage(models.Model):
     post = models.ForeignKey('Post', on_delete=models.CASCADE, related_name='images', null=True, blank=True)
     image = models.ImageField(upload_to='post_imgs/')

class Saved(models.Model):
     user = models.ForeignKey(Profile, on_delete=models.CASCADE)
     post = models.ForeignKey(Post, on_delete=models.CASCADE)
     timestamp = models.DateTimeField(auto_now_add=True)

class ChatRoom(models.Model):
     post = models.ForeignKey(Post, on_delete=models.CASCADE)
     master = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='chat_master')
     helper = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='chat_helper')

class Comment(models.Model):
     content = models.TextField()
     timestamp = models.DateTimeField(auto_now_add=True)
     chatroom = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
     writer = models.ForeignKey(Profile, on_delete=models.CASCADE)