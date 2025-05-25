# views.py
from django.shortcuts import render


# Create your views here.
def post_list(request):
    return render(request, 'posts/post_list.html')

def post_detail(request):
    return render(request, 'posts/post_detail.html')