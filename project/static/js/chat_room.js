// chat_room.js
//상태에 따라 버튼 이름 바꾸고, 비활성화하면 회색으로 변하게 하기

// 민감정보 버튼 클릭했을 때 뒷배경 어두워지면서 modal 뜨게 하기
function openSensitiveModal() {
    document.getElementById("sensitiveModal_sw").style.display = "block";
    document.getElementById("modalBackdrop_sw").style.display = "block";

  }

//   엑스 누르면 modal 닫게 하기
// 엑스 말고 다른 곳 눌러도 닫히게 하기? 고민해보기
function closeSensitiveModal() {
    document.getElementById("sensitiveModal_sw").style.display = "none";
    document.getElementById("modalBackdrop_sw").style.display = "none";
  }


//사진 보내기
document.addEventListener("DOMContentLoaded", function(){
  const photoForm = document.getElementById("photoForm_sw");
  const photoInput = document.getElementById("photoInput_sw");
  const photoBtn = document.getElementById("photoBtn_sw");

  photoBtn.addEventListener("click", function(){
    photoInput.click();
  });
   photoInput.addEventListener("change", function () {
    if (photoInput.files.length > 0) {
      photoForm.submit();
    }
  });
});
// 새로고침해도 채팅박스의 맨 밑을 보여주기
document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.querySelector(".chatBubblesFrameChatroom_sw");
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  });

// 거래가 시작될 때 거래가 시작된다는 메시지가 뜨게 하기
function showStartNotice(){

}
//완료 요청을 했을 때 완료 요청 메시지가 뜨게 하기
function showRequestNotice(){

}