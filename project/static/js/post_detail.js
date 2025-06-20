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

let currentIndex = 0;

function updateCarousel() {
    const track = document.querySelector('.carousel-track_sy');
    const images = document.querySelectorAll('.carousel-image_sy');

        totalImages = images.length;

    if (images.length === 0 || !track) return;

    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;
}

function prevImage() {
    const images = document.querySelectorAll('.carousel-image_sy');
    if (images.length === 0) return;

    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateCarousel();
}

function nextImage() {

    currentIndex = (currentIndex + 1) % totalImages;
    updateCarousel();
}

document.addEventListener("DOMContentLoaded", updateCarousel);
