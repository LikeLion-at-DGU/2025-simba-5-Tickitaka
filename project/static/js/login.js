document.addEventListener("DOMContentLoaded", function () {
    const loginFailed = document.getElementById("loginFailedFlag");
    const errorMsg = document.querySelector(".errorMsgLogin_sw");

    if (loginFailed && loginFailed.value && loginFailed.value === "1") {
        errorMsg.textContent = "아이디 또는 비밀번호가 올바르지 않습니다.";
    }
    else{
        errorMsg.textContent ="";
    }
});
