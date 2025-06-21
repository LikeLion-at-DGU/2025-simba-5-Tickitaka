// signup2.js
document.addEventListener('DOMContentLoaded', () => {
  // 공통 요소 캐싱
  const nicknameInput       = document.getElementById('nicknameInputSignup_sw');
  const nicknameCheckBtn    = document.getElementById('checkButtonSignup1_sw');
  const nicknameDescription = nicknameInput.parentElement.nextElementSibling;

  const schoolInput     = document.getElementById('schoolInputSignup_sw');
  const emailInput      = document.getElementById('emailCheckInputSignup_sw');
  const emailCheckBtn   = document.getElementById('checkButtonSignup3_sw');

  const codeInput       = document.getElementById('checkInputSignup_sw');
  const codeCheckBtn    = document.getElementById('checkButtonSignup2_sw');
  const codeErrorMsg    = document.getElementById('codeErrorMsg');

  const nextBtn         = document.getElementById('nextButtonSignup_sw');

  const photoInput      = document.getElementById('photoUpload');
  const photoContainer  = document.querySelector('.photoFrameEdit_sw');

  // 상태 변수
  let nicknameAvailable = false;
  let emailVerified     = false;
  let uniDomains        = {};  // 학교 도메인 캐시

  // CSRF 토큰 헬퍼
  function getCSRF() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
  }

  // 폼 활성화 체크
  function validateForm() {
    const allFilled = nicknameInput.value.trim()
                   && schoolInput.value.trim()
                   && emailInput.value.trim()
                   && codeInput.value.trim();
    nextBtn.disabled = !(allFilled && nicknameAvailable && emailVerified);
  }

  // 1) 닉네임 입력 → 버튼 활성화
  nicknameInput.addEventListener('input', () => {
    const len = nicknameInput.value.trim().length;
    nicknameAvailable = false;
    nicknameCheckBtn.disabled = !(len >= 4 && len <= 8);
    nicknameInput.classList.remove('inputSuccess_sw');
    nicknameDescription.classList.remove('textSuccess_sw');
    validateForm();
  });

  // 닉네임 중복 확인
  nicknameCheckBtn.addEventListener('click', () => {
    const nick = nicknameInput.value.trim();
    // 초기화
    nicknameInput.classList.remove('inputError_sw', 'inputSuccess_sw');
    nicknameDescription.classList.remove('textError_sw', 'textSuccess_sw');

    // 길이 재검사
    if (nick.length < 4 || nick.length > 8) {
      nicknameInput.classList.add('inputError_sw');
      nicknameDescription.classList.add('textError_sw');
      nicknameDescription.innerText = '닉네임은 4~8자 사이여야 합니다.';
      nicknameAvailable = false;
      nicknameCheckBtn.disabled = true;
      validateForm();
      return;
    }

    fetch(`/accounts/check_nickname/?nickname=${encodeURIComponent(nick)}`)
      .then(res => res.json())
      .then(data => {
        if (data.is_taken) {
          nicknameInput.classList.add('inputError_sw');
          nicknameDescription.classList.add('textError_sw');
          nicknameDescription.innerText = '이미 사용 중인 닉네임입니다.';
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

  // 2) 학교명 blur → 도메인 자동완성
  schoolInput.addEventListener('blur', () => {
    const name = schoolInput.value.trim();
    if (!name) return;
    if (Object.keys(uniDomains).length === 0) {
      fetch('/accounts/api/university-domains/')
        .then(res => res.json())
        .then(data => {
          uniDomains = data;
          applyDomain();
        });
    } else {
      applyDomain();
    }

    function applyDomain() {
      const dom = uniDomains[name];
      const local = emailInput.value.split('@')[0] || '';
      emailInput.value = dom
        ? (local ? `${local}@${dom}` : `@${dom}`)
        : emailInput.value;
    }
  });

  // 3) 이메일 인증번호 발송
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
        'X-CSRFToken': getCSRF(),
      },
      body: new URLSearchParams({ email })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('인증번호 발송 완료! 메일함을 확인하세요.');
      } else {
        alert(`오류: ${data.error}`);
      }
    });
  });

  // 4) 인증번호 확인
  codeCheckBtn.addEventListener('click', () => {
    const code = codeInput.value.trim();
    // 초기화
    codeInput.classList.remove('inputError_sw');
    codeErrorMsg.style.display = 'none';

    fetch('/accounts/verify_code/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRFToken': getCSRF(),
      },
      credentials: 'include',
      body: new URLSearchParams({ code })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        emailVerified = true;
        alert('이메일 인증 성공!');
      } else {
        emailVerified = false;
        codeInput.classList.add('inputError_sw');
        codeErrorMsg.innerText = '인증번호가 틀렸습니다.';
        codeErrorMsg.style.display = 'block';
      }
      validateForm();
    })
    .catch(() => {
      alert('서버 통신 오류');
      validateForm();
    });
  });

  // 5) 사진 업로드 미리보기
  photoInput.addEventListener('change', () => {
    const file = photoInput.files[0];
    if (!file) return;
    let img = photoContainer.querySelector('.photoPreview_sw');
    if (!img) {
      img = document.createElement('img');
      img.classList.add('photoPreview_sw');
      photoContainer.insertBefore(img, photoInput);
    }
    img.src = URL.createObjectURL(file);
  });

  // input 이벤트로 항상 유효성 재검사
  [nicknameInput, schoolInput, emailInput, codeInput].forEach(el => {
    el.addEventListener('input', validateForm);
  });

  // 초기 비활성화
  nicknameCheckBtn.disabled = true;
  nextBtn.disabled = true;
});
