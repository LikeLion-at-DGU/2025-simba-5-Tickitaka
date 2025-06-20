from django.shortcuts import render, redirect, get_object_or_404
from .models import *
from accounts.models import *
from posts.models import *
from chats.models import *
from friends.models import *

from django.core.mail import send_mail
from django.conf import settings
from django.contrib import messages

def mainpage(request):
    return render(request, 'main/test-mainpage.html')

# 마이페이지 관련 기능
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
    all_histories =  TimeHistory.objects.order_by('-timestamp')

    # 지급 type='plus'
    received_histories = TimeHistory.objects.filter(user=profile, type='plus').order_by('-timestamp')

    # 사용 type='minus'
    given_histories = TimeHistory.objects.filter(user=profile, type='minus').order_by('-timestamp')

    # 팁
    tip_histories = TimeHistory.objects.filter(user=profile, type='tip').order_by('-timestamp')

    return render(request, 'main/confirmed_time_history.html', {
        'all_histories' : all_histories,
        'received_histories': received_histories,
        'given_histories': given_histories,
        'tip_histories': tip_histories, 
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


# 신고하기
def report(request):
    if request.method == 'POST':
        subject = request.POST.get('subject')
        message = request.POST.get('message')
        sender_email = request.user.profile.email or request.user.email

        # 이메일 전송
        send_mail(
            subject=f"[시시콜콜 신고] {subject}",
            message=f"보낸 사람: {sender_email}\n\n내용:\n{message}",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=['sisicallcallnow@gmail.com'],
            fail_silently=False,
        )

        messages.success(request, "신고가 성공적으로 전송되었습니다!")
        return redirect('posts:post_list')

    return render(request, 'main/report.html')


def inquire(request):
    if request.method == 'POST':
        subject = request.POST.get('subject')
        message = request.POST.get('message')
        sender_email = request.user.profile.email or request.user.email

        # 이메일 전송
        send_mail(
            subject=f"[시시콜콜 1:1 문의] {subject}",
            message=f"보낸 사람: {sender_email}\n\n내용:\n{message}",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=['sisicallcallnow@gmail.com'],
            fail_silently=False,
        )

        messages.success(request, "문의가 성공적으로 전송되었습니다!")
        return redirect('posts:post_list')

    return render(request, 'main/inquire.html')