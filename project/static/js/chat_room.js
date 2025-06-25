// chat_room.js
// 여기부터 모달
// 민감정보 버튼 클릭했을 때 뒷배경 어두워지면서 modal 뜨게 하기
function openSensitiveModal() {
    document.getElementById('sensitiveModal_sw').style.display = 'block';
    document.getElementById('modalBackdrop_sw').style.display = 'block';
}
// 거래 요청 버튼 클릭했을 때 뒷배경 어두워지면서 startnotice 뜨게 하기
function openStartNotice() {
    document.getElementById('startModal_sw').style.display = 'flex';
    document.getElementById('modalBackdrop_sw').style.display = 'block';
}
// 완료 승인 버튼 클릭했을 때 뒷배경 어두워지면서 donenotice 뜨게 하기
function openDoneNotice() {
    document.getElementById('doneNotice_sw').style.display = 'flex';
    document.getElementById('modalBackdrop_sw').style.display = 'block';
}
//   엑스 누르면 modal 닫게 하기
function closeSensitiveModal() {
    document.getElementById('sensitiveModal_sw').style.display = 'none';
    document.getElementById('modalBackdrop_sw').style.display = 'none';
}
//   엑스나 아니요 누르면 startnotice 닫게 하기
function closeStartNotice() {
    document.getElementById('startNotice_sw').style.display = 'none';
    document.getElementById('modalBackdrop_sw').style.display = 'none';
}
//   엑스나 거절 누르면 donenotice 닫게 하기
function closeDoneNotice() {
    document.getElementById('doneNotice_sw').style.display = 'none';
    document.getElementById('modalBackdrop_sw').style.display = 'none';
}
// 여기까지 모달관련
// 전역 선언부
const chatBox = document.querySelector('.chatBubblesFrameChatroom_sw');
const sendBtn = document.getElementById('sendBtn_sw');
const form = document.querySelector('form.chatInputWrapperChatroom_sw');
const textarea = document.getElementById('commentinput_sw');
let isTyping = false;
let typingTimeout = null;
const pollInterval = 3000;
let prevChildCount = chatBox ? chatBox.children.length : 0;

// 페이지가 준비되면 한 번만 실행
document.addEventListener('DOMContentLoaded', () => {
    // 1) just_sent 애니메이션
    if (location.search.includes('just_sent=1')) {
        document.querySelectorAll('.new-comment').forEach((el) => {
            el.classList.remove('new-comment');
            void el.offsetWidth;
            el.classList.add('new-comment');
        });
        scrollLastBubbleIntoView();
        history.replaceState({}, '', location.pathname);
    }

    // 2) 사진 전송 핸들러
    const photoForm = document.getElementById('photoForm_sw');
    const photoInput = document.getElementById('photoInput_sw');
    const photoBtn = document.getElementById('photoBtn_sw');
    photoBtn.addEventListener('click', () => photoInput.click());
    photoInput.addEventListener('change', () => {
        if (photoInput.files.length) photoForm.submit();
    });

    // 3) 새로고침 전 scroll/카운트 저장
    window.addEventListener('beforeunload', () => {
        const bubbles = document.querySelectorAll('.myBubbleChatroom_sw, .opponentBubbleChatroom_sw');
        sessionStorage.setItem('previousScroll', chatBox.scrollTop);
        sessionStorage.setItem('prevBubbleCount', bubbles.length);
        if (document.activeElement === sendBtn) {
            sessionStorage.setItem('isSent', 'true');
        }
    });
    // 메시지 전송 폼(submit) 직전에 플래그
    form.addEventListener('submit', () => {
        sessionStorage.setItem('isSent', 'true');
    });
    // 4) 새로고침 후 스크롤 복원 or 맨 아래
    const nowBubblesCnt = document.querySelectorAll('.myBubbleChatroom_sw, .opponentBubbleChatroom_sw').length;
    const prevCnt = parseInt(sessionStorage.getItem('prevBubbleCount') || '0', 10);
    if (sessionStorage.getItem('isSent') === 'true' || nowBubblesCnt > prevCnt) {
        scrollLastBubbleIntoView();
        sessionStorage.removeItem('isSent');
    } else {
        setTimeout(() => {
            chatBox.scrollTop = parseInt(sessionStorage.getItem('previousScroll') || '0', 10);
        }, 30);
    }

    // 5) textarea 포커스 & 엔터 전송
    if (textarea) {
        textarea.focus();
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                form.submit();
            }
        });
    }

    // 6) 입력 감지
    textarea.addEventListener('input', () => {
        isTyping = true;
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => (isTyping = false), 10000);
    });

    // 7) 폴링 시작
    setInterval(fetchNewChats, pollInterval);
});

// 마지막 메시지 뷰로 스크롤해 주는 함수
function scrollLastBubbleIntoView() {
    const bubbles = chatBox.querySelectorAll('.myBubbleChatroom_sw, .opponentBubbleChatroom_sw');
    const last = bubbles[bubbles.length - 1];
    if (last) last.scrollIntoView({ block: 'end' });
}

// 폴링 실제 로직
async function fetchNewChats() {
    if (isTyping) return;
    try {
        const res = await fetch(location.href, { cache: 'no-store' });
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const newChatEl = doc.querySelector('.chatBubblesFrameChatroom_sw');
        if (!newChatEl) return;

        const newChildren = Array.from(newChatEl.children);
        const additions = newChildren.slice(prevChildCount);

        additions.forEach((node) => {
            const clone = node.cloneNode(true);
            clone.classList.add('new-comment');
            chatBox.appendChild(clone);

            const imgs = clone.querySelectorAll('img');
            imgs.forEach((img) => {
                if (!img.complete) {
                    img.addEventListener('load', () => {
                        scrollLastBubbleIntoView();
                    });
                }
            });
        });

        if (additions.length) scrollLastBubbleIntoView();
        prevChildCount = newChildren.length;
    } catch (e) {
        console.error('부분 fetch 에러:', e);
    }
}
