function selectAnswer(qid, value, element) {
    // 값 설정
    document.getElementById(qid).value = value;

    // 선택한 요소 강조 & 이미지 변경
    const siblings = element.parentElement.children;
    for (let sib of siblings) {
        sib.classList.remove('selected');

        const img = sib.querySelector('img');
        if (img) {
            const originalSrc = sib.getAttribute('data-original');
            if (originalSrc) {
                img.src = originalSrc;
            }
        }
    }

    element.classList.add('selected');

    const selectedImg = element.querySelector('img');
    const selectedSrc = element.getAttribute('data-selected');
    if (selectedImg && selectedSrc) {
        selectedImg.src = selectedSrc;
    }

    // 모든 항목 체크 여부 확인
    const q1 = document.getElementById('q1').value;
    const q2 = document.getElementById('q2').value;
    const q3 = document.getElementById('q3').value;
    const submitBtn = document.getElementById('review-submit-button');

    if (q1 !== '' && q2 !== '' && q3 !== '') {
        submitBtn.disabled = false;
        submitBtn.style.backgroundColor = '#025397';
        submitBtn.style.cursor = 'pointer';
    } else {
        submitBtn.disabled = true;
        submitBtn.style.backgroundColor = '#999';
        submitBtn.style.cursor = 'not-allowed';
    }
}
