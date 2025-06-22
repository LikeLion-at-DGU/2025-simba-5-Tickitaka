document.addEventListener('DOMContentLoaded', () => {

    // 남은 시간 카운트다운
    const timeElement = document.getElementById('remaining-time');

    if (timeElement) {
        const deadlineTimestamp = parseInt(timeElement.dataset.deadline);  // 밀리초
        const now = new Date().getTime();
        let remaining = Math.floor((deadlineTimestamp - now) / 1000); // 초 단위

        function formatTime(sec) {
            const hours = String(Math.floor(sec / 3600)).padStart(2, '0');
            const minutes = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
            const seconds = String(sec % 60).padStart(2, '0');
            return `
                <span class="big-num">${hours}</span><span class="small-unit">시간</span>
                <span class="big-num">${minutes}</span><span class="small-unit">분</span>
                <span class="big-num">${seconds}</span><span class="small-unit">초</span>
            `;
        }

        function updateCountdown() {
            if (remaining <= 0) {
                timeElement.innerHTML = `
                    <span class="big-num">00</span><span class="small-unit">시간</span>
                    <span class="big-num">00</span><span class="small-unit">분</span>
                    <span class="big-num">00</span><span class="small-unit">초</span>
                `;
                return;
            }
            timeElement.innerHTML = formatTime(remaining);
            remaining--;
        }

        updateCountdown(); // 최초 1회 실행
        setInterval(updateCountdown, 1000); // 1초마다 업데이트
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
