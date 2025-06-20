from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponseForbidden
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.db.models import Q
from django.utils import timezone

from .models import *
from accounts.models import *
from posts.models import *
from chats.models import *




@login_required
def chat_room(request, room_id):
    chatroom = get_object_or_404(ChatRoom, id=room_id)
    user_profile = request.user.profile

    if chatroom.master != user_profile and chatroom.helper != user_profile:
        return HttpResponseForbidden("채팅방에 접근 권한이 없습니다.")  # 403 반환
    
    post = chatroom.post
    comments = Comment.objects.filter(chatroom=chatroom).order_by('timestamp')
    
    read_status, created = ChatRoomReadStatus.objects.get_or_create(chatroom=chatroom, user=user_profile)
    read_status.last_read_at = timezone.now()
    read_status.save()
    
    opponent = chatroom.helper if chatroom.master == user_profile else chatroom.master
    

    return render(request, 'chats/chat_room.html', {
        'chatroom': chatroom,
        'post': post,
        'comments': comments,
        'me': user_profile,
        'opponent': opponent,
    })


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

    return redirect('main:mainpage')


# 수행 완료 요청
@require_POST
@login_required
def request_finish(request, room_id):
    chatroom = get_object_or_404(ChatRoom, id=room_id)
    user_profile = request.user.profile

    if chatroom.helper != user_profile:
        return HttpResponseForbidden("완료 요청 권한이 없습니다.")

    post = chatroom.post
    post.status = 'task_completed'  # 수행 완료로 상태 변경
    post.save()

    return redirect('chats:chat_room', room_id=room_id)



@login_required
def chat_list(request):
    user_profile = request.user.profile
    filter_type = request.GET.get('filter', 'all')

    if filter_type == 'master':
        chatrooms = ChatRoom.objects.filter(master=user_profile)
    elif filter_type == 'helper':
        chatrooms = ChatRoom.objects.filter(helper=user_profile)
    else:
        chatrooms = ChatRoom.objects.filter(Q(master=user_profile) | Q(helper=user_profile))

    chat_list = []
    for chatroom in chatrooms:
        read_status, created = ChatRoomReadStatus.objects.get_or_create(chatroom=chatroom, user=user_profile)


        unread_count = Comment.objects.filter(
            chatroom=chatroom,
            timestamp__gt=read_status.last_read_at
        ).count()

        print(f"ChatRoom {chatroom.id} - Unread: {unread_count}")

        chat_list.append({
            'chatroom': chatroom,
            'unread': unread_count,
        })

    return render(request, 'chats/chat_list.html', {
    'chat_list': chat_list,
    'me': user_profile,
    'filter_type': filter_type,
    })

def get_tip_percentage(answer):
    if answer == "2": 
        return 5
    elif answer == "1":
        return 3
    
    return 0


def process_review(request, post_id):
    post = get_object_or_404(Post, id=post_id)

    if request.method == "POST":
        # 마스터가 아닌 사용자가 접근 시 차단
        if post.master != request.user.profile:
            return redirect('/main/')

        q1 = request.POST.get('q1', '0')
        q2 = request.POST.get('q2', '0')
        q3 = request.POST.get('q3', '0')

        tip_percent = get_tip_percentage(q1) + get_tip_percentage(q2) + get_tip_percentage(q3)
        tip_amount = int(post.amounts * tip_percent / 100)

        if tip_amount > 0 and post.helper:
            post.helper.time_balance += tip_amount
            post.helper.save()

            TimeHistory.objects.create(
                user=post.helper,
                amounts=tip_amount,
                type='tip',
                post_id=post.id
            )

        return redirect('main:home')  # 후기 제출 후 메인으로 이동

    return render(request, 'chats/review.html', {'post': post})