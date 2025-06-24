from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.db import models
from django.urls import reverse


from .models import *
from chats.models import *
from posts.models import *
from accounts.models import *
from main.models import *


# 타인페이지
def other_profile(request, user_id):
     profile = get_object_or_404(Profile, user__id=user_id)
     
     total_minutes = profile.time_tip
     hours = total_minutes // 60
     minutes = total_minutes % 60

     # 콜? 완료글 = master + 거래완료
     call_question_done = Post.objects.filter(master=profile, status='done')
     # 콜! 완료글 = helper + 거래완료
     call_exclamation_done = Post.objects.filter(helper=profile, status='done')
     # 모집 중인 글 = master + waiting
     waiting_posts = Post.objects.filter(master=profile, status='waiting')
     context = {
          'profile': profile,
          'hours': hours,
          'minutes': minutes,
          'call_question_done': call_question_done,
          'call_question_count': call_question_done.count(),
          'call_exclamation_done': call_exclamation_done,
          'call_exclamation_count': call_exclamation_done.count(),
          'waiting_posts': waiting_posts,
     }

     return render(request, 'friends/other_profile.html', context)


# 친구 검색
@login_required
def friend_search(request):
     profile = request.user.profile
     query = request.GET.get('query', '')

     if query:
          profiles = Profile.objects.filter(nickname__istartswith=query).exclude(id=profile.id) # 앞부분 일치 검색
     else:
          profiles = Profile.objects.exclude(id=profile.id)

     result_list = []
     for p in profiles:
          try:
               friend_relation = Friend.objects.get(
                    (models.Q(requester=profile, receiver=p) | models.Q(requester=p, receiver=profile))
               )
               status = friend_relation.status
          except Friend.DoesNotExist:
               status = 'none'

          result_list.append({
               'profile': p,
               'status': status
          })

     context = {
          'results': result_list,
          'query': query,
          }
     return render(request, 'friends/friend_search.html', context)


# 친구 요청 보내기
@login_required
def send_friend_request(request, receiver_id):
     profile = request.user.profile
     receiver = get_object_or_404(Profile, id=receiver_id)

     if not Friend.objects.filter(
          (models.Q(requester=profile, receiver=receiver) | models.Q(requester=receiver, receiver=profile))
     ).exists():
          friend_request = Friend.objects.create(requester=profile, receiver=receiver, status='pending')
          FriendRequestNotification.objects.create(
               sender=profile,
               receiver=receiver,
               friend_request=friend_request,
          )

     query = request.POST.get('query', '')
     if query:
          return redirect(f"{reverse('friends:friend_search')}?query={query}")
     return redirect('friends:friend_search')

# 친구 요청 수락
@login_required
def accept_friend_request(request, request_id):
     friend_request = get_object_or_404(Friend, id=request_id, receiver=request.user.profile)

     if friend_request.status == 'pending':
          friend_request.status = 'accepted'
          friend_request.save()

     # 알림 읽음 처리
          try:
               notification = FriendRequestNotification.objects.get(friend_request=friend_request)
               notification.is_read = True
               notification.save()
          except FriendRequestNotification.DoesNotExist:
               pass

     return redirect('friends:friend_search')

# 친구 요청 거절
@login_required
def reject_friend_request(request, request_id):
     friend_request = get_object_or_404(Friend, id=request_id, receiver=request.user.profile)

     if friend_request.status == 'pending':
          friend_request.delete()  # 친구 요청 자체 삭제
          
          # 알림 읽음 처리
          try:
               notification = FriendRequestNotification.objects.get(friend_request=friend_request)
               notification.is_read = True
               notification.save()
          except FriendRequestNotification.DoesNotExist:
               pass

     return redirect('friends:friend_search')



# 친구 목록
@login_required
def friend_list(request):
     profile = request.user.profile

     friends = Friend.objects.filter(
          models.Q(requester=profile) | models.Q(receiver=profile),
          status='accepted'
     ).select_related('requester', 'receiver')

     friend_profiles = []
     for f in friends:
          if f.requester == profile:
               friend_profiles.append(f.receiver)
          else:
               friend_profiles.append(f.requester)


     # 빨간 점 표시 조건: 읽지 않은 알림이 있으면 표시
     unread_notification_exists = FriendRequestNotification.objects.filter(
          receiver=profile,
          is_read=False
     ).exists()

     context = {
          'friend_profiles': friend_profiles,
          'unread_notification_exists': unread_notification_exists,
     }
     return render(request, 'friends/friend_list.html', context)


@login_required
def received_notifications(request):
     profile = request.user.profile

     notifications = FriendRequestNotification.objects.filter(
          receiver=profile,
          is_read=False
     ).order_by('-timestamp')

     context = {
          'notifications': notifications
     }
     return render(request, 'friends/received_notifications.html', context)
