from django.shortcuts import render, redirect, get_object_or_404
from .models import *
from accounts.models import *
from posts.models import *
from chats.models import *
# Create your views here.


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

# 일단 보류
# def friend_list(request):
#     profile = request.user.profile

#     # 친구 요청 중 수락된 것만
#     friends = Friend.objects.filter(
#         models.Q(requester=profile) | models.Q(receiver=profile),
#         status='accepted'
#     ).select_related('requester', 'receiver')

#     # 상대방만 추출해서 리스트로 만들기
#     friend_profiles = []
#     for f in friends:
#         if f.requester == profile:
#             friend_profiles.append(f.receiver)
#         else:
#             friend_profiles.append(f.requester)

#     return render(request, 'main/friend_list.html', {
#         'friend_profiles': friend_profiles
#     })

