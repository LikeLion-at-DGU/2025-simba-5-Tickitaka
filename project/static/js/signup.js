document.addEventListener("DOMContentLoaded", function () {
  // 전화번호 유효성 검사
  const phoneInput = document.getElementById("phoneNumberInputSignup_sw");
  const phoneDescription = phoneInput.nextElementSibling;

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
  });

// 아이디 유효성 검사 + 중복확인 버튼
const idInput = document.getElementById("idInputSignup_sw");
const idDescription = idInput.parentElement.nextElementSibling;
const checkButton = document.querySelector(".checkButtonSignup_sw");

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
});




  // 비밀번호 유효성 검사
  const pwInput = document.getElementById("pwInputSignup_sw");
  const pwDescription = pwInput.nextElementSibling;

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
  });

  // 비밀번호 재확인 검사
  const pwCheckInput = document.getElementById("pwCheckInputSignup_sw");
  const pwCheckDescription = document.getElementById("pwCheckError");

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
  });
});
