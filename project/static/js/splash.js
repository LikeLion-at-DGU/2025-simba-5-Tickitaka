document.addEventListener("DOMContentLoaded", () => {
    const text = "시간이 부족할 때\n학교에서 찾는 도움 공유 플랫폼";
    const target = document.getElementById("splashText");
    const chars = [...text];  // 한글 처리 위해 spread 사용
    let index = 0;

    function typeChar() {
        if (index < chars.length) {
            const char = chars[index] === "\n" ? "<br>" : chars[index];
            target.innerHTML += char;
            index++;
            setTimeout(typeChar, 100);  // 100ms 간격
        }
    }

    typeChar();
});