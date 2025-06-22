// edit_profile.js

    //닉네임 조건 맞게 입력 시 버튼 활성화
    nicknameInput.addEventListener('input', () => {
        const nickname = nicknameInput.value.trim();
        nicknameAvailable = false;
        nicknameInput.classList.remove('inputSuccess_sw');
        nicknameDescription.classList.remove('textSuccess_sw');
        if (nickname.length >= 4 && nickname.length <= 8) {
            nicknameCheckBtn.disabled = false;
        } else {
            nicknameCheckBtn.disabled = true;
        }
        validateForm();
    });
