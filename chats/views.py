from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponseForbidden
from django.contrib.auth.decorators import login_required
from posts.models import ChatRoom, Comment, Post
from accounts.models import Profile
from django.views.decorators.http import require_POST

@login_required
def chat_room(request, room_id):
    chatroom = get_object_or_404(ChatRoom, id=room_id)

    # 접근 권한 확인: 현재 사용자가 master 또는 helper인지 확인
    user_profile = request.user.profile

    if chatroom.master != user_profile and chatroom.helper != user_profile:
        return HttpResponseForbidden("채팅방에 접근 권한이 없습니다.")  # 403 반환
    
    post = chatroom.post
    comments = Comment.objects.filter(chatroom=chatroom).order_by('timestamp')
    opponent = chatroom.helper if chatroom.master == user_profile else chatroom.master
    
    return render(request, 'chats/chat_room.html', {
        'chatroom': chatroom,
        'post': post,
        'comments': comments,
        'me': user_profile,
        'opponent': opponent,
    })


def chat_list(request):
    return render(request, 'chats/chat_list.html')


@require_POST
@login_required
def submit_chat(request, room_id):
    chatroom = get_object_or_404(ChatRoom, id=room_id)
    user_profile = request.user.profile

    if chatroom.master != user_profile and chatroom.helper != user_profile:
        return HttpResponseForbidden("채팅을 보낼 권한이 없습니다.")

    content = request.POST.get('content')
    image = request.FILES.get('image')

    if not content and not image:
        # 아무 내용도 없는 경우는 무시 (이미지와 텍스트 둘 다 없는 경우)
        return redirect('chats:chat_room', room_id=room_id)

    Comment.objects.create(chatroom=chatroom, writer=user_profile, content=content, image=image)

    return redirect('chats:chat_room', room_id=room_id)


@login_required
def fetch_chats(request, room_id):
    chatroom = get_object_or_404(ChatRoom, id=room_id)
    user_profile = request.user.profile

    if chatroom.master != user_profile and chatroom.helper != user_profile:
        return HttpResponseForbidden("채팅을 볼 권한이 없습니다.")

    comments = Comment.objects.filter(chatroom=chatroom).order_by('timestamp')
    opponent = chatroom.helper if chatroom.master == user_profile else chatroom.master

    return render(request, 'chats/chat_room.html', {
        'chatroom': chatroom,
        'post': chatroom.post,
        'comments': comments,
        'me': user_profile,
        'opponent': opponent,
    })