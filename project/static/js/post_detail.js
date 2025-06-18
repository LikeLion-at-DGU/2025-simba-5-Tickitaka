/**document.addEventListener("DOMContentLoaded", function () {
    const likeIcon = document.querySelector(".post-liked_sy svg");
    const likeCountText = document.querySelector(".post-liked-count_sy");

    let liked = false;
    let originalCount = parseInt(likeCountText.textContent);

    likeIcon.addEventListener("click", () => {
        if (!liked) {
            likeCountText.textContent = originalCount + 1;
            likeIcon.style.stroke = "black";
            likeIcon.style.fill = "black";
            liked = true;
        } else {
            likeCountText.textContent = originalCount;
            likeIcon.style.stroke = "black";
            likeIcon.style.fill = "none";
            liked = false;
        }
    });
});**/