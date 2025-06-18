from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponseForbidden
from django.contrib.auth.decorators import login_required
from posts.models import ChatRoom, Comment, Post
from accounts.models import Profile
from django.views.decorators.http import require_POST


@login_required
def chat_room(request, room_id):
    chatroom = get_object_or_404(ChatRoom, id=room_id)
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


# 채팅 전송
@require_POST
@login_required
def submit_chat(request, room_id):
    chatroom = get_object_or_404(ChatRoom, id=room_id)
    user_profile = request.user.profile

    if chatroom.master != user_profile and chatroom.helper != user_profile:
        return HttpResponseForbidden("채팅을 보낼 권한이 없습니다.")

    post = chatroom.post

    # 거래 취소 시 새 채팅 작성 불가하게 제한하기 위한 상태 체크
    if post.status == 'waiting' or post.status == 'done':
        return HttpResponseForbidden("현재 채팅 전송이 불가능한 상태입니다.")

    content = request.POST.get('content')
    image = request.FILES.get('image')

    if not content and not image:
        return redirect('chats:chat_room', room_id=room_id)

    Comment.objects.create(chatroom=chatroom, writer=user_profile, content=content, image=image)
    return redirect('chats:chat_room', room_id=room_id)



@login_required
def fetch_chats(request, room_id):
    chatroom = get_object_or_404(ChatRoom, id=room_id)
    user_profile = request.user.profile

    if chatroom.master != user_profile and chatroom.helper != user_profile:
        return HttpResponseForbidden("채팅을 볼 권한이 없습니다.")

    post = chatroom.post
    comments = Comment.objects.filter(chatroom=chatroom).order_by('timestamp')
    opponent = chatroom.helper if chatroom.master == user_profile else chatroom.master

    return render(request, 'chats/chat_room.html', {
        'chatroom': chatroom,
        'post': chatroom.post,
        'comments': comments,
        'me': user_profile,
        'opponent': opponent,
    })



# 거래 요청 (헬퍼만 가능)
@require_POST
@login_required
def start_transaction(request, room_id):
    chatroom = get_object_or_404(ChatRoom, id=room_id)
    user_profile = request.user.profile

    if chatroom.helper != user_profile:
        return HttpResponseForbidden("거래 시작 권한이 없습니다.")

    post = chatroom.post
    if post.status != 'chatting':
        return HttpResponseForbidden("거래 시작이 불가능한 상태입니다.")

    post.status = 'in_progress'
    post.save()

    return redirect('chats:chat_room', room_id=room_id)


# 거래 취소
@require_POST
@login_required
def cancel_transaction(request, room_id):
    chatroom = get_object_or_404(ChatRoom, id=room_id)
    user_profile = request.user.profile

    if chatroom.master != user_profile and chatroom.helper != user_profile:
        return HttpResponseForbidden("거래 취소 권한이 없습니다.")

    post = chatroom.post

    if post.status not in ['chatting', 'in_progress']:
        return HttpResponseForbidden("현재 거래 취소가 불가능한 상태입니다.")

    post.helper = None
    post.status = 'waiting'
    post.save()

    return redirect('main:home')



# 거래 완료 승인 (마스터만 가능)
@require_POST
@login_required
def approve_finish(request, room_id):
    chatroom = get_object_or_404(ChatRoom, id=room_id)
    user_profile = request.user.profile

    if chatroom.master != user_profile:
        return HttpResponseForbidden("완료 승인 권한이 없습니다.")

    post = chatroom.post
    post.status = 'done'
    post.save()

    return redirect('main:home')