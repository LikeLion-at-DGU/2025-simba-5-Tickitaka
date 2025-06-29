# 2025-simba-5-Tickitaka


# 🕰️ 시시콜콜

---

# 🎯 Our Service: 시시콜콜

**학교에서 시간이 부족할 때, 누군가의 도움이 필요한 순간**

시시콜콜은 캠퍼스 내에서 시간 기반으로 도움을 주고받는 **학교 커뮤니티 시간 거래 플랫폼**입니다. ⏳

누구나 자신의 여유 시간을 활용하여 도움을 제공하고, 시간 포인트로 보상을 받을 수 있어요. 
서로 협력하는 건강한 캠퍼스 문화를 만들어 갑니다! 🎓✨

---

# 🎯 Target User

## 👩‍🎓 도움이 필요한 학생들

### 😥 Pain Point
- 시간이 급할 때 도움을 요청하기가 쉽지 않아요.
- 도움을 줄 사람을 찾는 방법이 복잡해요.
- 이미 완료된 게시글인지 아닌지 파악하기 어려워요.

### 😆 Needs
- 간편하게 도움 요청을 올리고, 즉시 매칭될 수 있으면 좋겠어요!
- 신뢰할 수 있는 친구 또는 학교 구성원 기반으로 거래하고 싶어요!

## 👩‍🏫 도와줄 수 있는 학생들

### 😥 Pain Point
- 도와줄 수 있는 사람이 있어도 어디서 요청이 있는지 몰라요.
- 받은 시간 포인트를 쉽게 관리하기가 어려워요.

### 😆 Needs
- 내가 도와줄 수 있는 요청을 한 눈에 확인하고 신청할 수 있으면 좋아요!
- 나의 누적 시간 기록과 보상을 쉽게 관리할 수 있으면 좋아요!

---

# 🔑 Main Function

## 📝 회원가입 및 인증 시스템
- 학교 이메일 기반 회원가입 (도메인 인증 📧)
- 2단계 가입: 기본 정보 → 추가 프로필 설정
- 닉네임/이름 중복 확인 및 유효성 검증

## 📌 시간 거래 게시판
- 실시간으로 게시글 작성 / 수정 / 삭제 / 상세 조회
- 거래 진행 상태: 🟢 모집중 → 💬 채팅중 → 🔄 거래진행중 → ✅ 거래완료
- 거래 이력 자동 기록 (거래 시작/수행완료/종료 시점 기록)
- 이미지 첨부 및 저장(스크랩) 기능 ⭐

## 💬 실시간 채팅 시스템
- 1:1 채팅방 자동 생성
- 거래 상태 변화에 따른 시스템 알림 ⚙️
- 거래 중 취소/완료 요청 및 승인 시스템
- 거래 완료 후 리뷰 및 별점 남기기 🌟
- 채팅 읽음/안읽음 상태 관리

## 🤝 친구 시스템
- 친구 검색, 요청, 수락/거절 시스템
- 친구 알림 기능 🔔
- 나만의 신뢰 네트워크 형성 가능

## 🧭 마이페이지 및 관리 기능
- 내 프로필 관리 ✨
- 내가 작성한 글/저장한 글 리스트 관리
- 시간 거래 이력 상세 기록 (TimeHistory)
- 문의 및 신고 기능 📞

---

# 🛠️ 개발 환경 및 기술 스택

- **백엔드**: Django 5.2.3 (Python)
- **데이터베이스**: SQLite (개발 환경 기준)
- **프론트엔드**: Django Template 엔진 (HTML), Static Files
- **이메일 인증**: Gmail SMTP 연동
- **시간대 및 언어**: Asia/Seoul, 한국어 (ko-kr)

## 📦 프로젝트 의존성
- asgiref==3.8.1
- Django==5.2.3
- sqlparse==0.5.3
- tzdata==2025.2

---

# 🚀 설치 및 실행 방법

```bash
# 1️⃣ 프로젝트 클론 및 해당 디렉토리로 이동
$ git clone https://github.com/LikeLion-at-DGU/2025-simba-5-Tickitaka.git
$ cd 2025-simba-5-Tickitaka

# 2️⃣ 가상환경 생성 및 활성화
$ python -m venv venv
$ source venv/bin/activate  # Windows: source venv/Scripts/activate

# 3️⃣ 패키지 설치
$ pip install -r requirements.txt

# 4️⃣ Pillow 설치하기
$ pip install Pillow

# 5️⃣ 서버 실행
$ python manage.py runserver

# ‼️ 채팅을 테스트하려면 회원가입을 통해 두 계정을 만든 후 서로 다른 두 브라우저(ex: chrome edge)로 각각 로그인한 후 테스트하기


