// chat_room.js
// 여기부터 모달
// 민감정보 버튼 클릭했을 때 뒷배경 어두워지면서 modal 뜨게 하기
function openSensitiveModal() {
    document.getElementById('sensitiveModal_sw').style.display = 'block';
    document.getElementById('modalBackdrop_sw').style.display = 'block';
}
// 거래 요청 버튼 클릭했을 때 뒷배경 어두워지면서 startnotice 뜨게 하기
function openStartNotice() {
    document.getElementById("startModal_sw").style.display = "flex";
    document.getElementById("modalBackdrop_sw").style.display = "block";
}
// 완료 승인 버튼 클릭했을 때 뒷배경 어두워지면서 donenotice 뜨게 하기
function openDoneNotice() {
    document.getElementById('doneNotice_sw').style.display = 'flex';
    document.getElementById('modalBackdrop_sw').style.display = 'block';
}
//   엑스 누르면 modal 닫게 하기
function closeSensitiveModal() {
    document.getElementById("sensitiveModal_sw").style.display = "none";
    document.getElementById("modalBackdrop_sw").style.display = "none";
  }
//   엑스나 아니요 누르면 startnotice 닫게 하기
function closeStartNotice() {
    document.getElementById("startNotice_sw").style.display = "none";
    document.getElementById("modalBackdrop_sw").style.display = "none";
  }
  //   엑스나 거절 누르면 donenotice 닫게 하기
function closeDoneNotice() {
    document.getElementById("doneNotice_sw").style.display = "none";
    document.getElementById("modalBackdrop_sw").style.display = "none";
  }
// 여기까지 모달관련

//사진 보내기
document.addEventListener('DOMContentLoaded', function () {
    const photoForm = document.getElementById('photoForm_sw');
    const photoInput = document.getElementById('photoInput_sw');
    const photoBtn = document.getElementById('photoBtn_sw');

    photoBtn.addEventListener('click', function () {
        photoInput.click();
    });
    photoInput.addEventListener('change', function () {
        if (photoInput.files.length > 0) {
            photoForm.submit();
        }
    });
});

//여기부터 새로고침 스크롤, 채팅 수 보존
const chatBox = document.querySelector(".chatBubblesFrameChatroom_sw");
const sendBtn = document.getElementById("sendBtn_sw");
const previousScrollRaw = sessionStorage.getItem("previousScroll");
// null방지
const previousScrollTop = previousScrollRaw !== null ? parseInt(previousScrollRaw, 10) : 0;
const form = document.querySelector('form.chatInputWrapperChatroom_sw');

// 새로고침 직전 저장하는 것들
window.addEventListener('beforeunload', function () {
    const bubblesBefore = document.querySelectorAll('.myBubbleChatroom_sw, .opponentBubbleChatroom_sw');

    if (chatBox) {
        // 기존 스크롤 위치
        sessionStorage.setItem('previousScroll', chatBox.scrollTop);
        // 기존 채팅 개수
        sessionStorage.setItem('prevBubbleCount', bubblesBefore.length);
        // 전송 여부
        if (document.activeElement === sendBtn) {
            sessionStorage.setItem('isSent', 'true');
        }
    }
});

<<<<<<< HEAD
=======

document.addEventListener('DOMContentLoaded', () => {
  // URL에 just_sent=1 있을 때만 실행
  if (window.location.search.includes("just_sent=1")) {
    const newComments = document.querySelectorAll('.new-comment');
    newComments.forEach(el => {
      el.classList.remove('new-comment'); // 애니메이션 초기화
      void el.offsetWidth;                // 리플로우 유도
      el.classList.add('new-comment');   // 다시 붙여서 애니메이션 발동
    });

    // URL에서 just_sent 파라미터 제거
    const url = new URL(window.location);
    url.searchParams.delete('just_sent');
    window.history.replaceState({}, document.title, url.pathname);
  }
});
>>>>>>> f04f1ce051e12c43bcad79aa150b612ab1b2689d
// 새로고침됐을 때에
document.addEventListener('DOMContentLoaded', function () {
    const bubblesNow = document.querySelectorAll('.myBubbleChatroom_sw, .opponentBubbleChatroom_sw');
    const currentBubbleCount = bubblesNow.length;
    const prevCount = parseInt(sessionStorage.getItem('prevBubbleCount') || '0', 10);
    // 채팅 보낸 직후에는 맨 아래로 보냄
    if (sessionStorage.getItem('isSent') === 'true') {
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
        sessionStorage.removeItem('isSent');
    }
    // 채팅 수 늘었으면 = 누군가 보냈으니까 맨 아래로
    else if (currentBubbleCount > prevCount) {
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    // 아니면 원래 있던 위치에 계속 있음
    else {
        if (previousScrollTop !== null && chatBox) {
            setTimeout(() => {
                chatBox.scrollTop = previousScrollTop;
            }, 30);
        }
    }
    // 입력창
    if (textarea) {
        textarea.focus(); // 자동 포커스
    }
    textarea.addEventListener('keydown', function (event) {
        // 엔터 눌렀고, Shift 안 눌렸으면
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // 기본 줄바꿈 막기
            form.submit(); // 폼 제출
        }
    });
    console.log(currentBubbleCount);
    console.log(prevCount);
});

// 입력 감지
let isTyping = false;
let typingTimeout = null;
const textarea = document.getElementById('commentinput_sw');

if (textarea) {
    textarea.addEventListener('input', () => {
        isTyping = true;
        // 기존 타이머 삭제
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            isTyping = false;
        }, 10000);
        // 10초간 더 이상의 입력 없으면 입력하지 않은 걸로 간주
    });
}

window.addEventListener('DOMContentLoaded', () => {
  if (window.location.search.includes('just_sent=1')) {
    // 띠용 애니메이션 한 번 주고 나면 URL 파라미터 제거
    const url = new URL(window.location);
    url.searchParams.delete('just_sent');
    window.history.replaceState({}, document.title, url.pathname);
  }
});
let isSendingImage = false;


// // 자동 새로고침 (입력 중 아닐 때만)
// setInterval(() => {
//   if (!isTyping) {
//     location.reload();
//   }
// }, 5000);
//  
// 새로운 채팅이 있으면 맨 밑으로 내리기
document.addEventListener('DOMContentLoaded', () => {
  const chatBox      = document.querySelector('.chatBubblesFrameChatroom_sw');
  const pollInterval = 3000;
  let prevChildCount = chatBox.children.length;  // 처음 렌더링된 버블 개수

  setInterval(async () => {
    if (isTyping) return;

    try {
      const res  = await fetch(window.location.href, { cache: 'no-store' });
      if (!res.ok) return;
      const html = await res.text();
      const doc  = new DOMParser().parseFromString(html, 'text/html');
      const newChatEl = doc.querySelector('.chatBubblesFrameChatroom_sw');
      if (!newChatEl) return;

      // 새 렌더링된 전체 자식 엘리먼트
      const newChildren = Array.from(newChatEl.children);
      // 늘어난 부분만 취해서
      const additions = newChildren.slice(prevChildCount);

      additions.forEach(node => {
        // 깊은 복사
        const clone = node.cloneNode(true);
        // 팝 애니메이션 클래스 추가
        clone.classList.add('new-comment');
        // 실제 채팅창에 append
        chatBox.appendChild(clone);
      });

      // 새 메시지가 왔으면 맨 아래로 스크롤
      if (additions.length > 0) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }

      // 상태 업데이트
      prevChildCount = newChildren.length;

    } catch (e) {
      console.error('부분 fetch 에러:', e);
    }
  }, pollInterval);
});
