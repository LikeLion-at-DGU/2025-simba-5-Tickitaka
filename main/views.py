from django.shortcuts import render, redirect, get_object_or_404
from .models import *
from accounts.models import *
from posts.models import *
from chats.models import *
from friends.models import *
from django.db.models import Q
import random
from django.utils import timezone
from datetime import timedelta

from django.core.mail import send_mail
from django.conf import settings
from django.contrib import messages

def splash(request):
    return render(request, 'main/splash.html')

# 메인페이지 관련 기능
def home(request):
    profile = request.user.profile

    total_minutes = profile.time_balance
    hours = total_minutes // 60
    minutes = total_minutes % 60


    burning_posts = list(
        Post.objects.filter(
            burning=1,
            status='waiting', #거래 가능한 상태만
            # 내 게시글은 제외
        ).exclude(
            master = profile
        )
    )
    random.shuffle(burning_posts)
    burning_posts = burning_posts[:10]

    # 수행 중인 거래 중 가장 데드라인 빠른 게시글
    ongoing_post = (
        Post.objects.filter(status='in_progress', helper=profile).order_by('deadline').first()
    )

    # js 시간 객체와 맞추기 위한 초-> 밀리초 변환
    deadline_timestamp = None
    chatroom = None

    if ongoing_post:
        deadline_timestamp = int(ongoing_post.deadline.timestamp() * 1000)

        # 연결된 chatroom 찾기
        chatroom = ChatRoom.objects.filter(post=ongoing_post).first()
        

    return render(request, 'main/home.html', {
        'profile': profile,
        'hours': hours,
        'minutes': minutes,
        'burning_posts': burning_posts,
        'ongoing_post': ongoing_post,
        'deadline_timestamp': deadline_timestamp,
        'chatroom': chatroom,
        'show_navbar': True
    })


def my(request):
    profile = request.user.profile
    return render(request, 'main/my_page.html', {
        'profile': profile,
        'show_navbar': True
    })


def edit_profile(request):
    profile = request.user.profile
    uni_name = request.POST.get('university')

    if request.method == 'POST':
        # 사진만 왔을 때
        if 'image' in request.FILES:
            profile.image = request.FILES['image']

        # 닉네임만 왔을 때
        nickname = request.POST.get('nickname')
        if nickname:
            profile.nickname = nickname

        # 대학교만 왔을 때
        uni_id = request.POST.get('university')
        if uni_id:
            university = get_object_or_404(University, name=uni_name)
            profile.university = university

        profile.save()
        return redirect('main:edit_profile')

    universities = University.objects.all()
    return render(request, 'main/edit_profile.html', {
        'profile': profile,
        'universities': universities,
    })



def time_history(request):
    profile = request.user.profile

    all_histories =  TimeHistory.objects.filter(user=profile).select_related('post').order_by('-timestamp')

    # 지급 type='plus'
    received_histories = TimeHistory.objects.filter(user=profile, type='plus').select_related('post').order_by('-timestamp')

    # 사용 type='minus'
    given_histories = TimeHistory.objects.filter(user=profile, type='minus').select_related('post').order_by('-timestamp')

    # 팁
    tip_histories = TimeHistory.objects.filter(user=profile, type='tip').select_related('post').order_by('-timestamp')

    return render(request, 'main/time_history.html', {
        'profile' : profile,
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

