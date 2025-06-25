//  post_create.js
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('f2_inputCreate_sw').addEventListener('input', checkSubmitButton);
    document.getElementById('f3_inputCreate_sw').addEventListener('input', checkSubmitButton);
    document.getElementById('f5_dropdownPlaceCreate_sw').addEventListener('change', checkSubmitButton);
    document.getElementById('f5_calenderCreate_sw').addEventListener('change', checkSubmitButton);
    document.getElementById('f6_requireTimeCreate_sw').addEventListener('blur', checkSubmitButton);

    const input = document.getElementById('f5_calenderCreate_sw');
    if (!input.value) input.value = '';  // value가 이미 있으면 안 건드림

    flatpickr(input, {
        enableTime: true,
        dateFormat: 'Y-m-d H:i',
        time_24hr: true,
        position: 'above right',
        defaultDate: null,
        allowInput: false,
        clickOpens: true,
    });

    checkSubmitButton(); // flatpickr 바깥에 따로 호출
});

//  1. 사진 업로드 및 미리보기 기능
const uploadInput = document.getElementById('photoUpload');
const previewContainer = document.querySelector('.f1_photosFrameCreate_sw');
const photoCount = document.querySelector('.f1_photoAmountCreate_sw');

// 현재 이미지 수
let imageCount = document.querySelectorAll('.f1_previewImageWrapperCreate_sw').length;
photoCount.textContent = `${imageCount}/3`;
let selectedFiles = [];
uploadInput.addEventListener("change", function (e) {
  const files = Array.from(e.target.files);
  // 선택한 파일들을 배열로
  for(const file of files){
    if (!file || imageCount >= 3) break;
     selectedFiles.push(file);
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
            wrapper.querySelector('.f1_deletePreviewButtonCreate_sw').addEventListener('click', () => {
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
// edit의 html 사진 삭제 기능
document.querySelectorAll('.f1_deletePreviewButtonCreate_sw').forEach(btn => {
    btn.addEventListener('click', () => {

        const wrapper = btn.closest('.f1_previewImageWrapperCreate_sw');
        
        const hiddenInput = wrapper.querySelector('input[type="hidden"][name="delete_images"]');
              if (hiddenInput) {
            hiddenInput.disabled = false;
            // DOM 상단의 안전한 영역으로 이동 (예: form 맨 뒤)
            document.querySelector('form').appendChild(hiddenInput);
        }
        wrapper.remove();
        imageCount--;
        photoCount.textContent = `${imageCount}/3`;
        checkSubmitButton();
    });
});
// 글자 수 세기 함수
function updateWordCount(el) {
  const counter = el.nextElementSibling;
  if (!counter?.classList.contains('f234_wordCountCreate_sw')) return;
  const max = parseInt(counter.textContent.split('/')[1]);
  if (el.value.length > max) el.value = el.value.slice(0, max);
  counter.textContent = `${el.value.length}/${max}`;
}
//  2. 글자 수 실시간 표시 및 제한
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll("textarea, input[type='text']").forEach((el) => {
    updateWordCount(el); // 초기 글자 수 세기
    el.addEventListener('input', () => updateWordCount(el)); // 실시간
  });
});

//  3. 거래 위치 드롭다운 DB 연동은 HTML에서 for문 처리

//  4. 소요 시간 10분 단위 확인, 보유시간이 더 적은지 확인

const timeInput = document.querySelector('.f6_requireTimeCreate_sw');

timeInput.addEventListener('blur', () => {
    const val = parseInt(timeInput.value);
    if (val % 10 !== 0) {
        timeInput.value = '';
    }
    checkSubmitButton();
   
});


//  5. 1.5배 버튼 기능

let boostApplied = false;
let originalTime = null;

document.addEventListener('DOMContentLoaded', function () {
    const timeInput = document.getElementById('f6_requireTimeCreate_sw');
    const boostBtn = document.querySelector('.f7_buttonCreate_sw');
    const burningInput = document.getElementById('burning');

        if (burningInput.value === '1') {
        boostApplied = true;
        boostBtn.style.backgroundColor = '#025397';
        boostBtn.style.color = '#fff';
    }

    checkSubmitButton();
    boostBtn.addEventListener('click', () => {
        const currentVal = parseInt(timeInput.value);

        if (boostApplied) {
            // boost 해제는 무조건 허용
            timeInput.value = originalTime;
            originalTime = null;
            boostApplied = false;
            boostBtn.style.backgroundColor = '';
            boostBtn.style.color = '';
            burningInput.value = '0';
            checkSubmitButton();
            return;
        }

        // boost 적용할 때만 유효성 검사
        if (isNaN(currentVal) || currentVal % 10 !== 0) {
            alert('먼저 올바른 소요 시간을 입력하세요. (10분 단위)');
            return;
        }

        // boost 적용
        originalTime = currentVal;
        timeInput.value = Math.round(currentVal * 1.5);
        boostApplied = true;
        boostBtn.style.backgroundColor = '#025397';
        boostBtn.style.color = '#fff';
        burningInput.value = '1';
        checkSubmitButton();
    });
});

//  6. 작성완료 버튼 활성화 조건
const submitBtn = document.querySelector('.buttonFrameCreate_sw');

function checkSubmitButton() {
    const titleInput = document.getElementById('f2_inputCreate_sw');
    const descInput = document.getElementById('f3_inputCreate_sw');
    const locationInput = document.getElementById('f5_dropdownPlaceCreate_sw');
    const deadlineInput = document.getElementById('f5_calenderCreate_sw');
    const reqtimeInput = document.getElementById('f6_requireTimeCreate_sw');
    const available_time = parseInt(document.getElementById('availableTime').value, 10);
    const timeValue = parseInt(reqtimeInput.value, 10);

    const isValidTime = !isNaN(timeValue) && (boostApplied || timeValue % 10 === 0); 
    const timeOk = 0<timeValue && timeValue<=available_time;
    const hasTitle = titleInput.value.trim().length > 0;
    const hasDesc = descInput.value.trim().length > 0;
    const hasLocation = locationInput.value.trim().length > 0;
    const hasDeadline = deadlineInput.value.trim().length > 0;
    const allValid = hasTitle && hasDesc && hasLocation && hasDeadline && isValidTime && timeOk;
    
    // 시간 올바르게 입력
    const errorMsg = document.getElementById('timeErrorMsg');
    const timeValRaw = reqtimeInput.value.trim();
    if(timeValRaw===""){
            errorMsg.textContent = ` 현재 보유 시간은 ${available_time}분입니다.`;
             errorMsg.style.color = '#8A8A8A';
    reqtimeInput.classList.remove('inputErrorCreate_sw');
    }
    else if (!timeOk) {
        errorMsg.textContent = `보유 시간 ${available_time}분을 초과했거나 0분 이하입니다.`;
        reqtimeInput.classList.add('inputErrorCreate_sw');
    }
    else if(!isValidTime){
        errorMsg.textContent = `10분 단위로 입력해주세요.`;
        reqtimeInput.classList.add('inputErrorCreate_sw');  
    }
    else {
    errorMsg.textContent = '';
    reqtimeInput.classList.remove('inputErrorCreate_sw');
    }

    if (allValid) {
        submitBtn.style.background = '#025397';
        submitBtn.style.color = '#fff';
        submitBtn.style.pointerEvents = 'auto';
        submitBtn.style.opacity = 1;
    } else {
        submitBtn.style.background = '#666';
        submitBtn.style.color = '#fff';
        submitBtn.style.pointerEvents = 'none';
        submitBtn.style.opacity = 0.5;
    }
   
}

timeInput.addEventListener('input', checkSubmitButton); //  실시간 감지


// post_edit을 위한 js
document.addEventListener("DOMContentLoaded", function () {
    flatpickr("#f5_calenderCreate_sw", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        defaultDate: document.getElementById("f5_calenderCreate_sw").value || null
    });
});
