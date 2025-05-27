from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from .models import Profile
from main.models import University
from django.contrib.auth.models import User

def signup(request):
    if request.method == 'POST':
        name = request.POST.get('name') # 사용자 실명
        phone = request.POST.get('phone_number')
        username = request.POST.get('username')  # 아이디
        password = request.POST.get('password')

        request.session['signup_info'] = {
            'name': name,
            'phone': phone,
            'username': username,
            'password': password
        }
        return redirect('accounts:signup2')

    return render(request, 'accounts/signup.html')

def signup2(request):
    if request.method == 'POST':
        info = request.session.get('signup_info')
        if not info:
            return redirect('accounts:signup')

        nickname = request.POST.get('nickname')
        university_name = request.POST.get('university')
        email = request.POST.get('address')

        if not university_name:
            return render(request, 'accounts/signup2.html', {'error': '학교명을 입력해주세요.'})

        university, created = University.objects.get_or_create(name=university_name)

        #  1. User 생성
        user = User.objects.create_user(
            username=info['username'],
            password=info['password'],
        )
        user.first_name = info['name']
        user.save()

        #  2. 연결된 Profile 수정
        profile = user.profile
        profile.phone_number = info['phone']
        profile.nickname = nickname
        profile.email = email
        profile.university = university
        profile.save()

        return redirect('accounts:login')

    else:
        # GET 요청일 때 학교 리스트 넘겨주기
        universities = University.objects.all()
        return render(request, 'accounts/signup2.html', {'universities': universities})

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('main:mainpage')
        else:
            return render(request, 'accounts/login.html')
    return render(request, 'accounts/login.html')

def logout_view(request):
    logout(request)
    return redirect('main:mainpage')

from django.http import JsonResponse
from .models import Profile
from django.contrib.auth.models import User  # User 모델은 기본 Django 유저 모델



# 닉네임 중복 확인을 위한 뷰 함수
def check_nickname(request):
    # GET 요청에서 nickname 파라미터 값을 가져옴 (예: /check_nickname?nickname=kim)
    nickname = request.GET.get('nickname', '')

    # Profile 모델에서 nickname이 같은 레코드가 존재하는지 여부 확인
    is_taken = Profile.objects.filter(nickname=nickname).exists()

    # 결과를 JSON 형태로 응답 (프론트엔드에서 true면 중복된 닉네임이라는 뜻)
    return JsonResponse({'is_taken': is_taken})


# 아이디(=username) 중복 확인을 위한 뷰 함수
def check_username(request):
    # GET 요청에서 username 파라미터 값을 가져옴 (예: /check_username?username=kim123)
    username = request.GET.get('username', '')

    # User 모델에서 username이 같은 레코드가 존재하는지 여부 확인
    is_taken = User.objects.filter(username=username).exists()

    # 결과를 JSON 형태로 응답 (프론트엔드에서 true면 중복된 아이디라는 뜻)
    return JsonResponse({'is_taken': is_taken})
