// chat_room.js
//상태에 따라 버튼 이름 바꾸고, 비활성화하면 회색으로 변하게 하기

// 민감정보 버튼 클릭했을 때 modal 뜨게 하기
     function openSensitiveModal() {
    document.getElementById("sensitiveModal_sw").style.display = "block";
  }

//   엑스 누르면 modal 닫게 하기
     function closeSensitiveModal() {
    document.getElementById("sensitiveModal_sw").style.display = "none";
  }
//