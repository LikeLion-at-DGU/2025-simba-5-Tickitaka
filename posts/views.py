# views.py
from django.shortcuts import render
from .models import Post, University
from django.utils.timezone import now
from django.db.models import Q

def post_list(request):
     sort = request.GET.get('sort', 'latest')  # latest, deadline, time
     univ_id = request.GET.get('univ')
     building = request.GET.get('building')

     # 기본 쿼리셋
     posts = Post.objects.filter(deadline__gt=now())  # 마감 안 지난 것만

     # 필터링: 대학교
     if univ_id:
          posts = posts.filter(university__id=univ_id)

     # 필터링: 건물 이름
     if building:
          posts = posts.filter(building=building)

     # 정렬
     if sort == 'latest':
          posts = posts.order_by('-timestamp')
     elif sort == 'deadline':
          posts = posts.order_by('deadline')
     elif sort == 'time':
          posts = posts.order_by('-amounts')  # 시간 많은 순

     context = {
          'posts': posts,
          'selected_sort': sort,
          'current_univ': univ_id,
          'current_building': building,
          'universities': University.objects.all(),  # 선택 UI용
     }
     return render(request, 'posts/post_list.html', context)
