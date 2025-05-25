from django.shortcuts import render, redirect
from django.contrib import auth
from .models import User
from django.contrib.auth import logout
from django.http import JsonResponse


def signup(request):
    if request.method == 'POST':
        if request.POST['password'] == request.POST['confirm']:
            
            # university가 '대학교'로 끝나는지 검사
            if not request.POST['university'].endswith('대학교'):
                return render(request, 'accounts/test-signup.html', {'error': '학교명은 "00대학교"로 입력해주세요.'})

            # 전화번호가 숫자 11자리인지 검사
            if not request.POST['phone_number'].isdigit() or len(request.POST['phone_number']) != 11:
                return render(request, 'accounts/test-signup.html', {'error': '전화번호는 "00000000000"로 입력해주세요.'})
            
            user = User.objects.create_user(
                username=request.POST['username'],
                password=request.POST['password'],
                nickname=request.POST['nickname'],
                university=request.POST['university'],
                address=request.POST['address'],
                phone_number=request.POST['phone_number']
            )
            auth.login(request, user)
            return redirect('main:mainpage')  # 로그인 후 이동할 페이지
        
        else:
            return render(request, 'accounts/test-signup.html', {'error': '비밀번호가 일치하지 않습니다.'})
    
    return render(request, 'accounts/test-signup.html')
    


def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = auth.authenticate(request, username=username, password=password)

        if user is not None:
            auth.login(request, user)
            return redirect('main:mainpage')  # 로그인 성공 시 이동
        else:
            return render(request, 'accounts/test-login.html', {'error': '아이디 또는 비밀번호가 틀렸습니다.'})

    return render(request, 'accounts/test-login.html')


def logout_view(request):
    logout(request)
    return redirect('main:mainpage')  # 로그아웃 후 이동할 페이지


def check_nickname(request):
    nickname = request.GET.get('nickname', '')
    is_taken = User.objects.filter(nickname=nickname).exists()
    return JsonResponse({'is_taken': is_taken})