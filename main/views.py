from django.shortcuts import render, redirect, get_object_or_404
from .models import *
from accounts.models import *
from posts.models import *
from chats.models import *


from django.core.mail import send_mail
from django.conf import settings
from django.contrib import messages

# Create your views here.
def mainpage(request):
    return render(request, 'main/test-mainpage.html')

def home(request):
    profile = request.user.profile

    total_minutes = profile.time_balance
    hours = total_minutes // 60
    minutes = total_minutes % 60

    return render(request, 'main/home.html', {
        'profile': profile,
        'hours': hours,
        'minutes': minutes,
    })


def edit_profile(request):
    profile = request.user.profile

    if request.method == 'POST':
        nickname = request.POST.get('nickname')
        university_id = request.POST.get('university')
        image = request.FILES.get('image')

        profile.nickname = nickname

        if university_id:
            university = get_object_or_404(University, id=university_id)
            profile.university = university

        if image:
            profile.image = image

        profile.save()
        return redirect('home')

    universities = University.objects.all()
    return render(request, 'main/edit_profile.html', {
        'profile': profile,
        'universities': universities,
    })

def time_history(request):
    profile = request.user.profile
    histories = TimeHistory.objects.filter(user=profile).order_by('-timestamp')  # 최근순

    return render(request, 'main/time_history.html', {
        'histories': histories,
    })

def my_posts(request):
    profile = request.user.profile
    posts = Post.objects.filter(master=profile).order_by('-timestamp')  # 내가 쓴 글들, 최신순

    return render(request, 'main/my_posts.html', {
        'posts': posts,
    })


def saved_posts(request):
    profile = request.user.profile
    saved_list = Saved.objects.filter(user=profile).select_related('post').order_by('-timestamp')

    return render(request, 'main/saved_posts.html', {
        'saved_list': saved_list,
    })


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


