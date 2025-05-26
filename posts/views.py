# posts/views.py
from django.shortcuts import render
from .models import Post, University, Building
from django.utils.timezone import now

def post_list(request):
     posts = Post.objects.order_by('-timestamp')
     return render(request, 'posts/post_list.html', {'posts': posts})
