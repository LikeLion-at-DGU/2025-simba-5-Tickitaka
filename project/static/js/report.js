document.addEventListener('DOMContentLoaded', function () {
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const titleCount = document.getElementById('titleCount');
    const contentCount = document.getElementById('contentCount');
    const submitBtn = document.getElementById('submitBtn');
    const reportForm = document.getElementById('reportForm');

    // 글자 수 업데이트 함수
    function updateCharCount(input, countElement, maxLength) {
        const currentLength = input.value.length;
        countElement.textContent = `${currentLength}/${maxLength}`;

        // 글자 수 초과 시 스타일 변경
        if (currentLength > maxLength) {
            countElement.classList.add('over-limit');
            input.classList.add('over-limit');
        } else {
            countElement.classList.remove('over-limit');
            input.classList.remove('over-limit');
        }

        // 버튼 상태 업데이트
        updateSubmitButton();
    }

    // 제출 버튼 상태 업데이트
    function updateSubmitButton() {
        const titleValid = titleInput.value.trim().length > 0 && titleInput.value.length <= 30;
        const contentValid = contentInput.value.trim().length > 0 && contentInput.value.length <= 500;

        if (titleValid && contentValid) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }

    // 제목 입력 이벤트
    titleInput.addEventListener('input', function () {
        updateCharCount(this, titleCount, 30);
    });

    // 내용 입력 이벤트
    contentInput.addEventListener('input', function () {
        updateCharCount(this, contentCount, 500);
    });

    // 폼 제출 이벤트
    reportForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        // 유효성 검사
        if (!title) {
            alert('제목을 입력해주세요.');
            titleInput.focus();
            return;
        }

        if (title.length > 30) {
            alert('제목은 30자 이내로 입력해주세요.');
            titleInput.focus();
            return;
        }

        if (!content) {
            alert('신고 사유를 입력해주세요.');
            contentInput.focus();
            return;
        }

        if (content.length > 500) {
            alert('설명은 500자 이내로 입력해주세요.');
            contentInput.focus();
            return;
        }

        // 제출 확인
        if (confirm('신고를 제출하시겠습니까?')) {

            this.submit();
        }
    });


    updateSubmitButton();

    // 내용 입력창 자동 높이 조절
    contentInput.addEventListener('input', function () {
        autoResize(this);
    });

    titleInput.focus();
});