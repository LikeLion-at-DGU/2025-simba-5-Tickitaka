//  post_create.js
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("f2_inputCreate_sw").addEventListener("input", checkSubmitButton);
  document.getElementById("f3_inputCreate_sw").addEventListener("input", checkSubmitButton);
  document.getElementById("f5_dropdownPlaceCreate_sw").addEventListener("change", checkSubmitButton);
  document.getElementById("f5_calenderCreate_sw").addEventListener("change", checkSubmitButton);
  document.getElementById("f6_requireTimeCreate_sw").addEventListener("blur", checkSubmitButton);

  const input = document.getElementById("f5_calenderCreate_sw");
  input.value = "";
  flatpickr(input, {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    time_24hr: true,
    position: "below",
    defaultDate: null,
    allowInput: false,
    clickOpens: true
  });

  checkSubmitButton(); // flatpickr 바깥에 따로 호출
});


  //  1. 사진 업로드 및 미리보기 기능
  const uploadInput = document.getElementById("photoUpload");
  const previewContainer = document.querySelector(".f1_photosFrameCreate_sw");
  const photoCount = document.querySelector(".f1_photoAmountCreate_sw");

  let imageCount = 0;
  uploadInput.addEventListener("change", function (e) {
    const files = Array.from(e.target.files);
    for(const file of files){
    if (!file || imageCount >= 3) break;

    const reader = new FileReader();
    reader.onload = function (e) {
      const wrapper = document.createElement("div");//이미지 삭제 버튼 감싸기
      wrapper.className = "f1_previewImageWrapperCreate_sw";
      wrapper.innerHTML = `
        <img src="${e.target.result}" class="f1_previewImageCreate_sw" />
        <button type="button" class="f1_deletePreviewButtonCreate_sw">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0ZM10.297 6.63323C10.5924 6.33783 11.0713 6.33783 11.3667 6.63323C11.6621 6.92864 11.6621 7.40758 11.3667 7.70298L10.0697 9L11.3667 10.297C11.6621 10.5924 11.6621 11.0714 11.3667 11.3668C11.0713 11.6622 10.5924 11.6622 10.297 11.3668L8.99995 10.0698L7.70292 11.3668C7.40752 11.6622 6.92857 11.6622 6.63317 11.3668C6.33777 11.0714 6.33777 10.5924 6.63317 10.297L7.93021 9L6.63317 7.70298C6.33777 7.40758 6.33777 6.92864 6.63317 6.63323C6.92857 6.33783 7.40752 6.33783 7.70292 6.63323L8.99995 7.93027L10.297 6.63323Z" fill="#8A8A8A"/>
          </svg>
        </button>
      `;
      previewContainer.appendChild(wrapper);
      imageCount++;
      photoCount.textContent = `${imageCount}/3`;

      // 삭제 기능
      wrapper.querySelector(".f1_deletePreviewButtonCreate_sw").addEventListener("click", () => {
        previewContainer.removeChild(wrapper);
        imageCount--;
        photoCount.textContent = `${imageCount}/3`;
        checkSubmitButton();
      });
      checkSubmitButton();
    };
    reader.readAsDataURL(file);
  }
  });

  //  2. 글자 수 실시간 표시 및 제한
  document.querySelectorAll("textarea, input[type='text']").forEach((el) => {
    el.addEventListener("input", function () {
      const counter = el.nextElementSibling;
      if (!counter?.classList.contains("f234_wordCountCreate_sw")) return;
      const max = parseInt(counter.textContent.split("/")[1]);
      if (el.value.length > max) el.value = el.value.slice(0, max);
      counter.textContent = `${el.value.length}/${max}`;
    });
  });

  //  3. 거래 위치 드롭다운 DB 연동은 HTML에서 for문 처리

  //  4. 소요 시간 10분 단위 확인
  const timeInput = document.querySelector(".f6_requireTimeCreate_sw");
  timeInput.addEventListener("blur", () => {
    const val = parseInt(timeInput.value);
    if (val % 10 !== 0) {
      alert("10분 단위로 입력해주세요.");
      timeInput.value = "";
    }
    checkSubmitButton();
  });

  //  5. 1.5배 버튼 기능  
  
  let boostApplied = false;
  let originalTime = null;
  document.addEventListener("DOMContentLoaded", function () {
  const timeInput = document.getElementById("f6_requireTimeCreate_sw");
  const boostBtn = document.querySelector(".f7_buttonCreate_sw");
  const burningInput = document.getElementById("burning");

  boostBtn.addEventListener("click", () => {
    const currentVal = parseInt(timeInput.value);

    if (boostApplied) {
      // boost 해제는 무조건 허용
      timeInput.value = originalTime;
      originalTime = null;
      boostApplied = false;
      boostBtn.style.backgroundColor = "";
      boostBtn.style.color = "";
      burningInput.value = "0";
      checkSubmitButton();
      return;
    }

    // boost 적용할 때만 유효성 검사
    if (isNaN(currentVal) || currentVal % 10 !== 0) {
      alert("먼저 올바른 소요 시간을 입력하세요. (10분 단위)");
      return;
    }

    // boost 적용
    originalTime = currentVal;
    timeInput.value = Math.round(currentVal * 1.5);
    boostApplied = true;
    boostBtn.style.backgroundColor = "#025397";
    boostBtn.style.color = "#fff";
    burningInput.value = "1";
    checkSubmitButton();
  });
});


  //  6. 작성완료 버튼 활성화 조건
const submitBtn = document.querySelector(".buttonFrameCreate_sw");

function checkSubmitButton() {
  const titleInput = document.getElementById("f2_inputCreate_sw");
  const descInput = document.getElementById("f3_inputCreate_sw");
  const locationInput = document.getElementById("f5_dropdownPlaceCreate_sw");
  const deadlineInput = document.getElementById("f5_calenderCreate_sw");
  const reqtimeInput = document.getElementById("f6_requireTimeCreate_sw");

  const timeValue = parseInt(reqtimeInput.value);
const isValidTime = !isNaN(timeValue) && (boostApplied || timeValue % 10 === 0);

  const hasTitle = titleInput.value.trim().length > 0;
  const hasDesc = descInput.value.trim().length > 0;
  const hasLocation = locationInput.value.trim().length > 0;
  const hasDeadline = deadlineInput.value.trim().length > 0;

  const allValid = hasTitle && hasDesc && hasLocation && hasDeadline && isValidTime;

 if (allValid) {
  submitBtn.style.background = "#025397";
  submitBtn.style.color = "#fff";
  submitBtn.style.pointerEvents = "auto";
  submitBtn.style.opacity = 1;
} else {
  submitBtn.style.background = "#666";
  submitBtn.style.color = "#fff";
  submitBtn.style.pointerEvents = "none";
  submitBtn.style.opacity = 0.5;
}

}

timeInput.addEventListener("input", checkSubmitButton);  //  실시간 감지
timeInput.addEventListener("blur", () => {
  const val = parseInt(timeInput.value);
  if (val % 10 !== 0) {
    alert("10분 단위로 입력해주세요.");
    timeInput.value = "";
  }
  checkSubmitButton();
});

//엑스 버튼
document.addEventListener("DOMContentLoaded", function () {
  const closeButton = document.querySelector(".f1_closeButtonCreate_sw");
  closeButton.addEventListener("click", function () {
    window.location.href = "/"; //  메인 페이지 URL (루트)
  });
});
