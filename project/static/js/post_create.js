// post_create.js
document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("calendarInput");

  // ✅ 값 비우기
  input.value = "";

  // ✅ Flatpickr 연결
  flatpickr(input, {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    time_24hr: true,
    position: "below",
    defaultDate: null,     // 👈 이거 반드시!
    allowInput: false,     // 👈 직접 타이핑 비활성화 (선택사항)
    clickOpens: true       // 👈 클릭하면 무조건 달력 뜨게
  });
});