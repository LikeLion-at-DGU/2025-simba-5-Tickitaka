document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.home-logout_sy')?.addEventListener('click', () => {
        location.href = '/accounts/login/';
    });

    document.querySelector('.home-time-btn1-1_sy')?.addEventListener('click', () => {
        location.href = 'http://127.0.0.1:8000/posts/post_list/';
    });

    document.querySelector('.home-time-btn2-1_sy')?.addEventListener('click', () => {
        location.href = 'http://127.0.0.1:8000/posts/post_create/';
    });

    document.querySelector('.home-about-friend_sy')?.addEventListener('click', () => {
        location.href = 'http://127.0.0.1:8000/friends/friend/search/';
    });
});
