//  post_create.js

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("calendarInput");
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

  //  1. 사진 업로드 및 미리보기 기능
  const uploadInput = document.getElementById("photoUpload");
  const previewContainer = document.querySelector(".f1_photosFrameCreate_sw");
  const photoCount = document.querySelector(".f1_photoAmountCreate_sw");

  let imageCount = 0;
  uploadInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file || imageCount >= 3) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const wrapper = document.createElement("div");
      wrapper.className = "f1_previewImageWrapperCreate_sw";
      wrapper.innerHTML = `
        <img src="${e.target.result}" class="f1_previewImageCreate_sw" />
        <button type="button" class="f1_deletePreviewButtonCreate_sw">X</button>
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
  const boostBtn = document.querySelector(".f7_buttonCreate_sw");
  let boostApplied = false;
  boostBtn.addEventListener("click", () => {
    const val = parseInt(timeInput.value);
    if (!val || val % 10 !== 0) return alert("먼저 올바른 소요 시간을 입력하세요.");
    if (!boostApplied) {
      timeInput.value = Math.round(val * 1.5);
      boostApplied = true;
      boostBtn.style.backgroundColor = "#025397";
      boostBtn.style.color = "#fff";
    }
    checkSubmitButton();
  });

  //  6. 작성완료 버튼 활성화 조건
  const submitBtn = document.querySelector(".buttonFrameCreate_sw");
  function checkSubmitButton() {
    if (imageCount > 0 && boostApplied) {
      submitBtn.style.opacity = 1;
      submitBtn.style.pointerEvents = "auto";
    } else {
      submitBtn.style.opacity = 0.5;
      submitBtn.style.pointerEvents = "none";
    }
  }
  checkSubmitButton();
});
