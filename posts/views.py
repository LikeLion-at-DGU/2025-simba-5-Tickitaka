from django.shortcuts import render, redirect, get_object_or_404
from accounts.models import Profile
from .models import Post, Building
from django.utils.timezone import now
from django.contrib.auth.decorators import login_required
from datetime import datetime

@login_required
def post_list(request):
     user_profile = request.user.profile
     buildings = Building.objects.filter(university=user_profile.university)
     building_id = request.GET.get('building_id')  # 드롭다운 선택 파라미터
     sort_option = request.GET.get('sort', 'latest')  # 기본 정렬은 최신순
     burning_flag = request.GET.get('burning')  # '1'이면 버닝 게시글만

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
          'selected_building_name': selected_building_name
     })

@login_required
def post_detail(request, id):
     post = get_object_or_404(Post, id=id)
     return render(request, 'posts/post_detail.html', {
          'post': post
     })

@login_required
def post_create(request):
     user_profile = request.user.profile

     if request.method == 'POST':
          title = request.POST.get('title')
          content = request.POST.get('content')
          private_info = request.POST.get('private_info')  # ← 오타 수정됨
          building_name = request.POST.get('building')  # 이름 기준으로 넘어옴
          deadline_str = request.POST.get('deadline')
          amounts = request.POST.get('amounts')
          burning = 1 if request.POST.get('burning') == '1' else 0

          # 🔹 building name → id 변환
          building = get_object_or_404(Building, name=building_name, university=user_profile.university)

          # 🔹 마감 시간 파싱
          try:
               deadline = datetime.fromisoformat(deadline_str)
          except ValueError:
               deadline = now()  # fallback 처리 (또는 에러 반환)

          # 🔹 Post 생성
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

          # 🔹 이미지 처리
          for img in request.FILES.getlist('images'):
               PostImage.objects.create(post=post, image=img)

          return redirect('posts:post_list')

     buildings = Building.objects.filter(university=user_profile.university)
     return render(request, 'posts/post_lis.html', {
          'buildings': buildings
     })