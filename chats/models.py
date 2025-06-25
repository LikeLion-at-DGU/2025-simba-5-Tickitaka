from django.db import models
from posts.models import ChatRoom
from accounts.models import Profile
from django.db.models.signals import post_save
from django.dispatch import receiver



class ChatRoomReadStatus(models.Model):
    chatroom = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    last_read_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('chatroom', 'user')

@receiver(post_save, sender=ChatRoom)
def create_read_status(sender, instance, created, **kwargs):
    if created:
        # 이중 방어 (중복 생성 방지)
        ChatRoomReadStatus.objects.get_or_create(chatroom=instance, user=instance.master)
        ChatRoomReadStatus.objects.get_or_create(chatroom=instance, user=instance.helper)