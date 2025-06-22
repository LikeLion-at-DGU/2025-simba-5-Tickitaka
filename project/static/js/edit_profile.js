// edit_profile.js

document.addEventListener('DOMContentLoaded', () => {
    const nicknameInput = document.getElementById('nicknameInputSignup_sw');
    const nicknameCheckBtn = document.getElementById('checkButtonSignup1_sw');
    const nicknameDescription = nicknameInput.parentElement.nextElementSibling;

    const schoolInput = document.getElementById('schoolInputSignup_sw');
    const emailInput = document.getElementById('emailCheckInputSignup_sw');
    const codeInput = document.getElementById('checkInputSignup_sw');
    const codeCheckBtn = document.getElementById('checkButtonSignup2_sw');
    const codeErrorMsg = document.getElementById('codeErrorMsg');

    const emailCheckBtn = document.getElementById('checkButtonSignup3_sw');
    const emailHelperText = document.getElementById('emailHelperText');

    let nicknameAvailable = false;
    let emailVerified = false;

    // 학교 도메인 자동완성
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

    // 이메일 인증 요청
    emailCheckBtn.addEventListener('click', () => {
        const email = emailInput.value.trim();

        if (!email.includes('@')) {
            emailInput.classList.remove('inputSuccess_sw');
            emailInput.classList.add('inputError_sw');
            emailStatusMsg.classList.remove('textSuccess_sw');
            emailStatusMsg.classList.add('textError_sw');
            emailStatusMsg.innerText = '올바른 이메일 형식을 입력해주세요.';
            emailStatusMsg.style.display = 'block';
            return;
        }

        emailInput.classList.remove('inputError_sw', 'inputSuccess_sw');
        emailStatusMsg.style.display = 'none';
        emailStatusMsg.innerText = '';

        fetch('/accounts/send_verification_code/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCSRFToken(),
            },
            body: new URLSearchParams({ email }),
        })
            .then((response) => response.text())
            .then((text) => {
                try {
                    const data = JSON.parse(text);
                    emailStatusMsg.style.display = 'block';
                    if (data.success) {
                        emailInput.classList.add('inputSuccess_sw');
                        emailStatusMsg.classList.remove('textError_sw');
                        emailStatusMsg.classList.add('textSuccess_sw');
                        emailStatusMsg.innerText = '이메일이 발송되었습니다!';
                        emailHelperText.style.display = 'none';
                    } else {
                        emailInput.classList.add('inputError_sw');
                        emailStatusMsg.classList.remove('textSuccess_sw');
                        emailStatusMsg.classList.add('textError_sw');
                        emailStatusMsg.innerText = '이메일 발송 오류입니다!';
                    }
                } catch (e) {
                    console.error('JSON 파싱 실패:', text);
                }
            })
            .catch((err) => {
                console.error('이메일 인증 요청 실패:', err);
                emailInput.classList.add('inputError_sw');
                emailStatusMsg.classList.remove('textSuccess_sw');
                emailStatusMsg.classList.add('textError_sw');
                emailStatusMsg.innerText = '서버와의 통신 오류입니다!';
                emailStatusMsg.style.display = 'block';
            });
    });

    // 인증번호 확인
    codeCheckBtn.addEventListener('click', () => {
        const code = codeInput.value.trim();

        codeInput.classList.remove('inputError_sw');
        codeErrorMsg.classList.remove('textError_sw', 'textSuccess_sw');
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
                    codeErrorMsg.classList.add('textSuccess_sw');
                    codeErrorMsg.innerText = '인증 완료되었습니다!';
                    codeErrorMsg.style.display = 'block';
                    codeInput.classList.remove('inputError_sw');
                    codeInput.classList.add('inputSuccess_sw');
                } else {
                    emailVerified = false;
                    codeInput.classList.add('inputError_sw');
                    codeErrorMsg.classList.add('textError_sw');
                    codeErrorMsg.innerText = data.error || '인증번호가 틀렸습니다.';
                    codeErrorMsg.style.display = 'block';
                }
                validateForm();
            })
            .catch((err) => {
                emailVerified = false;
                console.error('[verify_code] fetch 오류:', err);
                validateForm();
            });
    });

    // 닉네임 입력 감지
    nicknameInput.addEventListener('input', () => {
        const nickname = nicknameInput.value.trim();
        nicknameAvailable = false;
        nicknameInput.classList.remove('inputSuccess_sw', 'inputError_sw');
        nicknameDescription.classList.remove('textSuccess_sw', 'textError_sw');

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

    function getCSRFToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]').value;
    }
});
