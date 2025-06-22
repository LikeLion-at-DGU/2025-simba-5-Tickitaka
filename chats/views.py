from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponseForbidden
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.db.models import Q
from django.utils import timezone

from .models import *
from accounts.models import *
from posts.models import *
from friends.models import *
from main.models import *


@login_required
def chat_room(request, room_id):
    chatroom = get_object_or_404(ChatRoom, id=room_id)
    user_profile = request.user.profile

    if chatroom.master != user_profile and chatroom.helper != user_profile:
        return HttpResponseForbidden("채팅방에 접근 권한이 없습니다.")  # 403 반환
    
    post = chatroom.post
    comments = list(Comment.objects.filter(chatroom=chatroom).order_by('timestamp')) # QuerySet을 list로 변환하여 인덱스 접근
    
    # is_last_of_group & prev_is_notice 계산
    for i, comment in enumerate(comments):
        comment.is_last_of_group = False  # 기본은 False
        comment.prev_is_notice = False # 기본은 False

        # 이전 댓글이 존재할 때 prev_is_notice 설정
        if i > 0 and comments[i-1].is_system:
            comment.prev_is_notice = True

        # 마지막 댓글은 무조건 그룹의 끝
        if i == len(comments) - 1:
            comment.is_last_of_group = True
            continue

        # 다음 댓글과 비교
        next_comment = comments[i+1]
        same_writer = (comment.writer_id == next_comment.writer_id)
        same_minute = (comment.timestamp.strftime('%Y-%m-%d %H:%M') == next_comment.timestamp.strftime('%Y-%m-%d %H:%M'))

        if not (same_writer and same_minute):
            comment.is_last_of_group = True


    read_status, created = ChatRoomReadStatus.objects.get_or_create(chatroom=chatroom, user=user_profile)
    read_status.last_read_at = timezone.now()
    read_status.save()
    
    opponent = chatroom.helper if chatroom.master == user_profile else chatroom.master
    
    startnotice = False
    requestnotice = False

    if post.status == 'in_progress':
        start_session_key = f"startnotice_shown_{room_id}"
        if not request.session.get(start_session_key, False):
            startnotice = True
            request.session[start_session_key] = True

    if post.status == 'task_completed':
        request_session_key = f"requestnotice_shown_{room_id}"
        if not request.session.get(request_session_key, False):
            requestnotice = True
            request.session[request_session_key] = True
    
    return render(request, 'chats/chat_room.html', {
        'chatroom': chatroom,
        'post': post,
        'comments': comments,
        'me': user_profile,
        'opponent': opponent,
        'transaction_started_at': post.transaction_started_at,   
        'task_completed_at': post.task_completed_at,            
        'transaction_finished_at': post.transaction_finished_at,
        'startnotice': startnotice,
        'requestnotice': requestnotice,
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

    Comment.objects.create(
        chatroom=chatroom, 
        writer=user_profile, 
        content=content or '', 
        image=image,
        is_system=False  # 일반 채팅 메시지임을 명시
    )

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
        'post': post,
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
    post.transaction_started_at = timezone.now()
    post.save()
    
    # 시스템 메시지에 시각 찍어주기
    now = timezone.now()
    formatted_time = now.strftime("%I시 %M분").lstrip('0')  # 1시 35분 형식
    system_message = f"{formatted_time}에 거래가 시작됐습니다!\n메뉴를 눌러 민감 정보를 확인해 주세요."

    Comment.objects.create(
        chatroom=chatroom,
        content=system_message,
        is_system=True,  # 시스템 메시지 표시
        timestamp=timezone.now(),
    )

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
    amounts = post.amounts

    if post.master.time_balance < amounts:
        return HttpResponseForbidden("보유 시간 부족으로 거래 완료 불가합니다.")


    # 거래 승인 처리
    post.status = 'done'  
    post.transaction_finished_at = timezone.now()  # 거래 완료 시간 기록
    post.save()

    # 마스터 잔액 차감 및 기록
    post.master.time_balance -= amounts
    post.master.save()

    TimeHistory.objects.create(
        user=post.master,
        amounts=-amounts,
        type='minus',
        post_id=post.id
    )

    # 헬퍼 잔액 적립 및 기록
    post.helper.time_balance += amounts
    post.helper.save()

    TimeHistory.objects.create(
        user=post.helper,
        amounts=amounts,
        type='plus',
        post_id=post.id
    )

    Comment.objects.create(
        chatroom=chatroom,
        content="거래가 최종 완료되었습니다. 수고하셨습니다!",
        is_system=True,
        timestamp=timezone.now(),
    )

    return redirect('chats:review', post_id=post.id)


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

    now = timezone.now()
    post.task_completed_at = now
    post.save()

    # 시간 포맷 생성
    formatted_time = now.strftime("%I시 %M분").lstrip('0')

    system_message = (
        f"{formatted_time}에 거래 완료가 요청됐습니다.\n"
        f"1시간 안에 응답하지 않으면 자동으로 완료처리 됩니다."
    )


    Comment.objects.create(
        chatroom=chatroom,
        content=system_message,
        is_system=True,
        timestamp=timezone.now(),
    )

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
        
        opponent = chatroom.helper if chatroom.master == user_profile else chatroom.master

        # 마지막 채팅 시간 구하기
        last_comment = Comment.objects.filter(chatroom=chatroom).order_by('-timestamp').first()
        if last_comment:
            last_chat_time = last_comment.timestamp
        else:
            last_chat_time = chatroom.post.timestamp

        chat_list.append({
            'chatroom': chatroom,
            'unread': unread_count,
            'opponent': opponent,
            'last_chat_time': last_chat_time,
        })

    # 최신 채팅 순으로 정렬
    chat_list_sorted = sorted(chat_list, key=lambda x: x['last_chat_time'], reverse=True)

    return render(request, 'chats/chat_list.html', {
    'chat_list': chat_list_sorted,
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
            post.helper.time_tip += tip_amount
            post.helper.available_time += tip_amount
            post.helper.save()

            TimeHistory.objects.create(
                user=post.helper,
                amounts=tip_amount,
                type='tip',
                post_id=post.id
            )

        return redirect('posts:post_list')  # 후기 제출 후 메인으로 이동

    return render(request, 'chats/review.html', {'post': post})

# 거래 승인 거절 (마스터만 가능)
@require_POST
@login_required
def reject_finish(request, room_id):
    chatroom = get_object_or_404(ChatRoom, id=room_id)
    user_profile = request.user.profile

    if chatroom.master != user_profile:
        return HttpResponseForbidden("거래 거절 권한이 없습니다.")

    post = chatroom.post

    # task_completed 상태에서만 거절 가능
    if post.status != 'task_completed':
        return HttpResponseForbidden("거절할 수 없는 상태입니다.")

    # 상태를 다시 in_progress로 되돌림
    post.status = 'in_progress'
    post.save()

    # 시스템 메시지 기록
    Comment.objects.create(
        chatroom=chatroom,
        content="마스터가 거래 완료 요청을 거절했습니다. 작업을 이어서 진행해주세요.",
        is_system=True,
        timestamp=timezone.now(),
    )

    return redirect('chats:chat_room', room_id=room_id)
