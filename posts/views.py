from django.shortcuts import render, get_object_or_404
from .models import Post, Building
from django.utils.timezone import now
from django.contrib.auth.decorators import login_required

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
    if request.method == 'POST':
        # 작성 처리
        pass

    user_profile = request.user.profile
    buildings = Building.objects.filter(university=user_profile.university)

    return render(request, 'posts/post_create.html', {
        'buildings': buildings
    })
