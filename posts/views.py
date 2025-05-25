from django.shortcuts import render
from .models import Post, University
from django.utils.timezone import now
from django.db.models import Q

# Create your views here.
def post_list(request):
     return render(request, 'posts/post_list.html')

def post_detail(request):
     return render(request, 'posts/post_detail.html')