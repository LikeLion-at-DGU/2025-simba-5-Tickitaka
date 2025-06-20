from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.db import models
from .models import Friend
from accounts.models import Profile
from posts.models import Post


# 타인페이지
def other_profile(request, user_id):
     profile = get_object_or_404(Profile, user__id=user_id)
     # 콜? 완료글 = master + 거래완료
     call_question_done = Post.objects.filter(master=profile, status='done')
     # 콜! 완료글 = helper + 거래완료
     call_exclamation_done = Post.objects.filter(helper=profile, status='done')
     # 모집 중인 글 = master + waiting
     waiting_posts = Post.objects.filter(master=profile, status='waiting')
     context = {
          'profile': profile,
          'call_question_done': call_question_done,
          'call_question_count': call_question_done.count(),
          'call_exclamation_done': call_exclamation_done,
          'call_exclamation_count': call_exclamation_done.count(),
          'waiting_posts': waiting_posts,
     }

     return render(request, 'main/other_profile.html', context)


# 친구 검색
@login_required
def friend_search(request):
     profile = request.user.profile
     query = request.GET.get('query', '')

     if query:
          profiles = Profile.objects.filter(nickname__icontains=query).exclude(id=profile.id)
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
          Friend.objects.create(requester=profile, receiver=receiver, status='pending')

     return redirect('friends:friend_search')


# 친구 요청 수락
@login_required
def accept_friend_request(request, request_id):
     friend_request = get_object_or_404(Friend, id=request_id, receiver=request.user.profile)

     if friend_request.status == 'pending':
          friend_request.status = 'accepted'
          friend_request.save()

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

     context = {
          'friend_profiles': friend_profiles
     }
     return render(request, 'friends/friend_list.html', context)