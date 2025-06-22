from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.utils.timezone import now
from datetime import datetime
from django.views.decorators.http import require_POST

from django.contrib.auth.decorators import login_required

from .models import *
from accounts.models import *
from main.models import *
from chats.models import *
from friends.models import *

@login_required
def post_list(request):
     user_profile = request.user.profile
     buildings = Building.objects.filter(university=user_profile.university)
     building_id = request.GET.get('building_id')  # 드롭다운 선택 파라미터
     sort_option = request.GET.get('sort', 'latest')  # 기본 정렬은 최신순
     burning_flag = request.GET.get('burning')  # '1'이면 버닝 게시글만
     friend_only = request.GET.get('friend_only') # 1이면 친구만

     posts = Post.objects.filter(
          university=user_profile.university,
          deadline__gt=now(),
          status='waiting'
     )

     # 건물 필터
     selected_building_name = None
     if building_id and building_id != 'all':
          posts = posts.filter(building__id=building_id)
          try:
               selected_building = Building.objects.get(id=building_id)
               selected_building_name = selected_building.name
          except Building.DoesNotExist:
               selected_building_name = None

     # 버닝 필터
     if burning_flag == '1':
          posts = posts.filter(burning=1)

     # 친구만 필터
     if friend_only == '1':
          # 내가 보낸 친구 요청 중 accepted 된 사람들
          sent_friends = Friend.objects.filter(requester=user_profile, status='accepted').values_list('receiver', flat=True)
          # 내가 받은 친구 요청 중 accepted 된 사람들
          received_friends = Friend.objects.filter(receiver=user_profile, status='accepted').values_list('requester', flat=True)
          
          friend_ids = list(sent_friends) + list(received_friends)
          posts = posts.filter(master__in=friend_ids)

     # 정렬 기준 적용
     if sort_option == 'latest':
          posts = posts.order_by('-timestamp')
     elif sort_option == 'deadline':
          posts = posts.order_by('deadline')
     elif sort_option == 'amounts':
          posts = posts.order_by('-amounts')
     else:
          posts = posts.order_by('-timestamp')  # 예외 시 기본 적용
     
     return render(request, 'posts/post_list.html', {
          'posts': posts,
          'buildings': buildings,
          'selected_building_id': building_id,
          'selected_sort': sort_option,
          'burning_flag': burning_flag,
          'friend_only': friend_only,
          'selected_building_name': selected_building_name
     })

@login_required
def post_detail(request, id):
     post = get_object_or_404(Post, id=id)
     is_saved = Saved.objects.filter(user=request.user.profile, post=post).exists()
     return render(request, 'posts/post_detail.html', {
          'post': post,
          'is_saved': is_saved,
     })

@login_required
def post_create(request):
     user_profile = request.user.profile
     buildings = Building.objects.filter(university=user_profile.university)

     if request.method == 'POST':
          title = request.POST.get('title')
          content = request.POST.get('content')
          private_info = request.POST.get('private_info') 
          deadline_str = request.POST.get('deadline')
          amounts = int(request.POST.get('amounts'))
          burning = 1 if request.POST.get('burning') == '1' else 0
          building_id = request.POST.get('building')
          building = get_object_or_404(Building, id=building_id, university=user_profile.university)

          try:
               deadline = datetime.fromisoformat(deadline_str)
          except ValueError:
               deadline = now()

          if user_profile.available_time < int(amounts):
               return render(request, 'posts/post_create.html', {
                    'buildings': buildings,
                    'available_time': user_profile.available_time,
                    'error': '잔여 타임이 부족합니다.'
               })

          # 사용 가능 시간 차감
          user_profile.available_time -= amounts
          user_profile.save()

          post = Post.objects.create(
               title=title,
               content=content,
               private_info=private_info,
               building=building,
               amounts=int(amounts),
               deadline=deadline,
               status='waiting',
               saved_count=0,
               master=user_profile,
               university=user_profile.university,
               burning=burning
          )

          for img in request.FILES.getlist('images'):
               PostImage.objects.create(post=post, image=img)

          return redirect('posts:post_list')  # 생성 후 리스트 페이지로 리다이렉트

     # GET 요청 → 글 작성 폼
     return render(request, 'posts/post_create.html', {
          'buildings': buildings,
          'available_time': user_profile.available_time
     })


def post_edit(request, id):
     post = get_object_or_404(Post, id=id, master=request.user.profile)
     user_profile = request.user.profile

     restored_available_time = user_profile.available_time + post.amounts

     buildings = Building.objects.filter(university=user_profile.university)

     return render(request, 'posts/post_edit.html', {
          'post': post,
          'buildings': buildings,
          'available_time': restored_available_time
     })


def post_update(request, id):
     post = get_object_or_404(Post, id=id, master=request.user.profile)
     user_profile = request.user.profile
     buildings = Building.objects.filter(university=request.user.profile.university)

     if request.method == 'POST':
          new_amounts = int(request.POST.get('amounts'))
          # 이전 예약 시간 복구
          restored_time = user_profile.available_time + post.amounts 

          # 복구된 시간을 기준으로 잔여 가능 시간 확인
          if restored_time < new_amounts:
               buildings = Building.objects.filter(university=user_profile.university)
               return render(request, 'posts/post_update.html', {
                    'post': post,
                    'buildings': buildings,
                    'available_time': restored_time,
                    'error': '잔여 타임이 부족합니다.'
               })
          
          post.title = request.POST.get('title')
          post.content = request.POST.get('content')
          post.private_info = request.POST.get('private_info')
          post.amounts = new_amounts
          post.burning = 1 if request.POST.get('burning') == '1' else 0

          deadline_str = request.POST.get('deadline')
          try:
               post.deadline = datetime.fromisoformat(deadline_str)
          except ValueError:
               post.deadline = now()

          post.building = get_object_or_404(
               Building,
               id=request.POST.get('building'),
               university=user_profile.university
          )

          post.save()

          # 시간 복구 + 새 예약 반영
          user_profile.available_time = restored_time - new_amounts
          user_profile.save()

          # 기존 이미지 삭제
          delete_image_ids = request.POST.getlist('delete_images')
          for image_id in delete_image_ids:
               try:
                    image = post.postimage_set.get(id=image_id)
                    image.delete()
               except PostImage.DoesNotExist:
                    continue

          # 새 이미지 추가
          for img in request.FILES.getlist('images'):
               PostImage.objects.create(post=post, image=img)

          return redirect('posts:post_detail', id=post.id)
     
     return redirect('posts:post_list')


@login_required
def post_delete(request, id):
     post = get_object_or_404(Post, id=id, master=request.user.profile)
     user_profile = request.user.profile

     if request.method == 'POST':
          user_profile.available_time += post.amounts
          user_profile.save()
          post.delete()
          return redirect('posts:post_list')

     return render(request, 'posts/post_confirm_delete.html', {
          'post': post
     })


@login_required
@require_POST
def toggle_saved(request, post_id):
     user_profile = request.user.profile
     post = get_object_or_404(Post, id=post_id)

     saved, created = Saved.objects.get_or_create(user=user_profile, post=post)

     if not created:
          # 이미 찜한 상태면 제거
          saved.delete()

     # saved_count 업데이트
     post.saved_count = Saved.objects.filter(post=post).count()
     post.save()

     # 찜 후 다시 post_detail로 리다이렉트
     return redirect('posts:post_detail', id=post.id)



# 콜 기능 (헬퍼 지정 + 채팅방 생성)
@login_required
@require_POST
def call_post(request, post_id):
     user_profile = request.user.profile
     post = get_object_or_404(Post, id=post_id)

     if post.master == user_profile or post.helper or post.status != 'waiting':
          return render(request, 'posts/post_detail.html', {
               'post': post,
               'error': '콜할 수 없는 게시글입니다.'
          })

     post.helper = user_profile
     post.status = 'chatting'
     post.save()
     chatroom = ChatRoom.objects.create(post=post, master=post.master, helper=user_profile)

     return redirect('chats:chat_room', room_id=chatroom.id)  # 채팅방 페이지로 이동
