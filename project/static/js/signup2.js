// signup2.js
document.addEventListener('DOMContentLoaded', () => {
    const nicknameInput = document.getElementById('nicknameInputSignup_sw');
    const nicknameCheckBtn = document.getElementById('checkButtonSignup1_sw');
    const nicknameDescription = nicknameInput.parentElement.nextElementSibling;

    const schoolInput = document.getElementById('schoolInputSignup_sw');
    const emailInput = document.getElementById('emailCheckInputSignup_sw');
    const codeInput = document.getElementById('checkInputSignup_sw');
    const codeCheckBtn = document.getElementById('checkButtonSignup2_sw');
    const codeErrorMsg = document.getElementById('codeErrorMsg');

    const nextBtn = document.getElementById('nextButtonSignup_sw');
    // 여기부터 수현 수정함
    const emailCheckBtn = document.getElementById('checkButtonSignup3_sw');

    // 학교별 도메인 자동완성
    schoolInput.addEventListener('blur', () => {
        const schoolName = schoolInput.value.trim();

        fetch('/accounts/api/university-domains/')
            .then((response) => response.json())
            .then((data) => {
                const domain = data[schoolName];
                if (domain) {
                    const localPart = emailInput.value.split('@')[0] || '';
                    emailInput.value = localPart ? `${localPart}@${domain}` : `@${domain}`;
                }
            })
            .catch(() => {
                console.warn('도메인 자동완성 실패');
            });
    });

    emailCheckBtn.addEventListener('click', () => {
        const email = emailInput.value.trim();

        if (!email.includes('@')) {
            alert('올바른 이메일 형식을 입력해주세요.');
            return;
        }

        fetch('/accounts/send_verification_code/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCSRFToken(),
            },
            body: new URLSearchParams({ email }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert('인증번호가 발송되었습니다. 메일함을 확인해주세요.');
                } else {
                    alert('오류 발생: ' + data.error);
                }
            })
            .catch(() => {
                alert('서버와의 통신 중 문제가 발생했습니다.');
            });
    });

    // CSRF 토큰 추출 함수 (이미 닉네임 쪽에도 있음)
    function getCSRFToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]').value;
    }

    nicknameCheckBtn.disabled = true;
    let nicknameAvailable = false;
    let emailVerified = false;

    //닉네임 조건 맞게 입력 시 버튼 활성화
    nicknameInput.addEventListener('input', () => {
        const nickname = nicknameInput.value.trim();
        nicknameAvailable = false;
        nicknameInput.classList.remove('inputSuccess_sw');
        nicknameDescription.classList.remove('textSuccess_sw');
        if (nickname.length >= 4 && nickname.length <= 8) {
            nicknameCheckBtn.disabled = false;
        } else {
            nicknameCheckBtn.disabled = true;
        }
        validateForm();
    });

    // 닉네임 중복 확인
    nicknameCheckBtn.addEventListener('click', () => {
        const nickname = nicknameInput.value.trim();

        // 초기화
        nicknameInput.classList.remove('inputError_sw', 'inputSuccess_sw');
        nicknameDescription.classList.remove('textError_sw', 'textSuccess_sw');

        if (nickname.length < 4 || nickname.length > 8) {
            nicknameInput.classList.add('inputError_sw');
            nicknameDescription.classList.add('textError_sw');
            nicknameDescription.innerText = '닉네임은 4~8자 사이여야 합니다.';
            nicknameAvailable = false;
            validateForm();
            return;
        }

        fetch(`/accounts/check_nickname/?nickname=${encodeURIComponent(nickname)}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.is_taken) {
                    nicknameInput.classList.add('inputError_sw');
                    nicknameDescription.classList.add('textError_sw');
                    nicknameDescription.innerText = '이미 사용 중인 닉네임입니다. 닉네임을 다시 입력해주세요.';
                    nicknameAvailable = false;
                } else {
                    nicknameInput.classList.add('inputSuccess_sw');
                    nicknameDescription.classList.add('textSuccess_sw');
                    nicknameDescription.innerText = '사용 가능한 닉네임입니다!';
                    nicknameAvailable = true;
                }
                nicknameCheckBtn.disabled = true;
                validateForm();
            });
    });

    // 인증번호 확인
    codeCheckBtn.addEventListener('click', () => {
        const code = codeInput.value.trim();

        // 초기화
        codeInput.classList.remove('inputError_sw');
        codeErrorMsg.classList.remove('textError_sw');
        codeErrorMsg.style.display = 'none';
        codeErrorMsg.innerText = '';

        fetch('/accounts/verify_code/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCSRFToken(),
            },
            body: new URLSearchParams({ code }),
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    emailVerified = true;
                    alert('인증 완료되었습니다!');
                } else {
                    emailVerified = false;
                    codeInput.classList.add('inputError_sw');
                    codeErrorMsg.classList.add('textError_sw');
                    codeErrorMsg.innerText = '인증번호가 틀렸습니다.';
                    codeErrorMsg.style.display = 'block';
                }
                validateForm();
            })
            .catch(() => {
                emailVerified = false;
                alert('서버 통신 중 오류가 발생했습니다.');
                validateForm();
            });
    });

    // 모든 입력값이 유효한지 검사
    function validateForm() {
        const nickname = nicknameInput.value.trim();
        const school = schoolInput.value.trim();
        const email = emailInput.value.trim();
        const code = codeInput.value.trim();

        const allFilled = nickname && school && email && code;
        nextBtn.disabled = !(allFilled && nicknameAvailable && emailVerified);
    }

    // 실시간 입력 감지
    [nicknameInput, schoolInput, emailInput, codeInput].forEach((input) => {
        input.addEventListener('input', validateForm);
    });

    // 버튼 초기 비활성화
    nextBtn.disabled = true;
});
