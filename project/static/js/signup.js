document.addEventListener("DOMContentLoaded", () => {
  // 요소 가져오기
  const nextBtn = document.getElementById("nextButtonSignup_sw");
  const nameInput = document.getElementById("nameInputSignup_sw");
  const phoneInput = document.getElementById("phoneNumberInputSignup_sw");
  const idInput = document.getElementById("idInputSignup_sw");
  const pwInput = document.getElementById("pwInputSignup_sw");
  const pwCheckInput = document.getElementById("pwCheckInputSignup_sw");
  const checkButton = document.getElementById("checkButtonSignup_sw");
  //오류 메시지 표시용 <small>  
  const phoneDescription = phoneInput.nextElementSibling;
  const idDescription = idInput.parentElement.nextElementSibling;
  const pwDescription = pwInput.nextElementSibling;
  const pwCheckDescription = document.getElementById("pwCheckError_sw");

  // 버튼 초기 비활성화(css에서 색이랑 클릭도 바꿈)
  nextBtn.disabled = true;
  checkButton.disabled = true;

  // 유효성 검사 함수
  function validateForm() {
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const userId = idInput.value.trim();
    const pw = pwInput.value;
    const pwCheck = pwCheckInput.value;

    const isPhoneValid = /^\d+$/.test(phone); //숫자만
    const isIdValid = userId.length >= 4 && userId.length <= 16; 
    const isPwValid =
      pw.length >= 8 &&
      pw.length <= 16 &&
      /[a-zA-Z]/.test(pw) &&
      /\d/.test(pw) &&
      /[^a-zA-Z0-9]/.test(pw);
    const isPwMatch = pw === pwCheck;

    const isAllFilled = name && phone && userId && pw && pwCheck;

    // 버튼 활성화 조건
    if (isAllFilled && isPhoneValid && isIdValid && isPwValid && isPwMatch) {
      nextBtn.disabled = false;
    } else {
      nextBtn.disabled = true;
    }
  }

  // 전화번호 유효성 검사
  phoneInput.addEventListener("input", function () {
    const value = phoneInput.value;
    if (!/^\d*$/.test(value)) {
      phoneInput.classList.add("inputError_sw");
      phoneDescription.classList.add("textError_sw");
      phoneDescription.innerText = "숫자만 입력해주세요";
    } else {
      phoneInput.classList.remove("inputError_sw");
      phoneDescription.classList.remove("textError_sw");
      phoneDescription.innerText = "-을 제외하고 입력해주세요";
    }
    validateForm();//올바르게 되면 버튼 상태 업데이트
  });

  // 아이디 유효성 검사
  idInput.addEventListener("input", function () {
    const value = idInput.value;
    if (value === "") {
      idInput.classList.remove("inputError_sw");
      idDescription.classList.remove("textError_sw");
      idDescription.innerText = "4자 이상 ~ 16자 이하로 입력해주세요";
      checkButton.disabled = true;
    } else if (value.length < 4 || value.length > 16) {
      idInput.classList.add("inputError_sw");
      idDescription.classList.add("textError_sw");
      idDescription.innerText = "4자 이상 ~ 16자 이하로 입력해주세요";
      checkButton.disabled = true;
    } else {
      idInput.classList.remove("inputError_sw");
      idDescription.classList.remove("textError_sw");
      idDescription.innerText = "4자 이상 ~ 16자 이하로 입력해주세요";
      checkButton.disabled = false;
    }
    validateForm();
  });

//아이디 겹치면 다시 입력하라고 하기
checkButton.addEventListener("click", function () {
  const username = idInput.value.trim();

  if (username.length < 4 || username.length > 16) {
    idInput.classList.remove("inputSuccess_sw");
    idDescription.classList.remove("textSuccess_sw");
    
    idInput.classList.add("inputError_sw");
    idDescription.classList.add("textError_sw");
    idDescription.innerText = "아이디는 4자 이상 16자 이하로 입력해주세요.";
    return;
  }

  // fetch로 중복 확인 요청 보내기
  fetch(`/accounts/check_username/?username=${encodeURIComponent(username)}`)
    .then(response => response.json())
    .then(data => {
      // 공통: 기존 클래스 제거
      idInput.classList.remove("inputError_sw", "inputSuccess_sw");
      idDescription.classList.remove("textError_sw", "textSuccess_sw");

      if (data.is_taken) {
        idInput.classList.add("inputError_sw");
        idDescription.classList.add("textError_sw");
        idDescription.innerText = "이미 사용 중인 아이디입니다.";
      } else {
        idInput.classList.remove("inputError_sw");
        idDescription.classList.remove("textError_sw");
        idDescription.innerText = "사용 가능한 아이디입니다!";
      }
    })
    .catch(() => {
      alert("중복 확인 중 오류가 발생했습니다.");
    });
});



  // 비밀번호 유효성 검사
  pwInput.addEventListener("input", function () {
    const value = pwInput.value;
    const isValid =
      value.length >= 8 &&
      value.length <= 16 &&
      /[a-zA-Z]/.test(value) &&
      /\d/.test(value) &&
      /[^a-zA-Z0-9]/.test(value);

    if (value === "") {
      pwInput.classList.remove("inputError_sw");
      pwDescription.classList.remove("textError_sw");
      pwDescription.innerText = "8~16자 이내의 영문, 숫자, 특수문자를 입력해주세요";
    } else if (!isValid) {
      pwInput.classList.add("inputError_sw");
      pwDescription.classList.add("textError_sw");
      pwDescription.innerText = "비밀번호는 영문, 숫자, 특수문자를 포함해 8~16자여야 합니다.";
    } else {
      pwInput.classList.remove("inputError_sw");
      pwDescription.classList.remove("textError_sw");
      pwDescription.innerText = "8~16자 이내의 영문, 숫자, 특수문자를 입력해주세요";
    }
    validateForm();
  });

  // 비밀번호 재확인 검사
  pwCheckInput.addEventListener("input", function () {
    const pwValue = pwInput.value;
    const checkValue = pwCheckInput.value;

    if (checkValue === "") {
      pwCheckInput.classList.remove("inputError_sw");
      pwCheckDescription.style.display = "none";
      pwCheckDescription.classList.remove("textError_sw");
      pwCheckDescription.innerText = "";
    } else if (pwValue !== checkValue) {
      pwCheckInput.classList.add("inputError_sw");
      pwCheckDescription.style.display = "block";
      pwCheckDescription.classList.add("textError_sw");
      pwCheckDescription.innerText = "비밀번호가 일치하지 않습니다";
    } else {
      pwCheckInput.classList.remove("inputError_sw");
      pwCheckDescription.style.display = "none";
      pwCheckDescription.classList.remove("textError_sw");
      pwCheckDescription.innerText = "";
    }
    validateForm();
  });

  // next 버튼 클릭 시 form 제출
  nextBtn.addEventListener("click", () => {
    document.getElementById("signupinfo").submit();
  });
});
