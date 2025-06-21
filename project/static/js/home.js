document.addEventListener('DOMContentLoaded', () => {
    // 기존 버튼 이벤트
    document.querySelector('.home-logout_sy')?.addEventListener('click', () => {
        location.href = '/accounts/login/';
    });

    document.querySelector('.home-time-btn1-1_sy')?.addEventListener('click', () => {
        location.href = 'http://127.0.0.1:8000/posts/post_list/';
    });

    document.querySelector('.home-time-btn2-1_sy')?.addEventListener('click', () => {
        location.href = 'http://127.0.0.1:8000/posts/post_create/';
    });

    document.querySelector('.home-about-friend_sy')?.addEventListener('click', () => {
        location.href = 'http://127.0.0.1:8000/friends/friend/search/';
    });

    // 남은 시간 카운트다운
    const timeElement = document.getElementById('remaining-time');
    if (timeElement) {
        let remaining = parseInt(timeElement.dataset.seconds);

        function formatTime(sec) {
            const hours = String(Math.floor(sec / 3600)).padStart(2, '0');
            const minutes = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
            const seconds = String(sec % 60).padStart(2, '0');
            return `${hours}시간 ${minutes}분 ${seconds}초`;
        }

        function updateCountdown() {
            if (remaining <= 0) {
                timeElement.textContent = "00시간 00분 00초";
                return;
            }
            timeElement.textContent = formatTime(remaining);
            remaining--;
        }

        updateCountdown(); // 최초 실행
        setInterval(updateCountdown, 1000); // 1초마다 갱신
    }

    // 1.5배 게시글 슬라이드
    const wrapper = document.querySelector('.home-boost-post-wrapper_sy');
    const slider = document.querySelector('.home-boost-post-content_sy');
    const slides = document.querySelectorAll('.post-content_sy');
    const nextBtn = document.querySelector('.to-right-btn_sy');

    let currentIndex = 0;
    let intervalId;

    function updateSlide() {
        const slideWidth = wrapper.offsetWidth;
        slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlide();
    }

    function startAutoSlide() {
        intervalId = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(intervalId);
    }

    if (slides.length > 0) {
        updateSlide();
        startAutoSlide();

        nextBtn.addEventListener('click', nextSlide);
        wrapper.addEventListener('mouseenter', stopAutoSlide);
        wrapper.addEventListener('mouseleave', startAutoSlide);

        window.addEventListener('resize', updateSlide);
    }
});
