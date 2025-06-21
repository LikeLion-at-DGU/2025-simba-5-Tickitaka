document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const sort = params.get('sort') || 'all';

    // 탭별 목록 전환
    document.getElementById('all_list').style.display = 'none';
    document.getElementById('plus_list').style.display = 'none';
    document.getElementById('minus_list').style.display = 'none';

    if (sort === 'input') {
        document.getElementById('plus_list').style.display = 'flex';
    } else if (sort === 'output') {
        document.getElementById('minus_list').style.display = 'flex';
    } else {
        document.getElementById('all_list').style.display = 'flex';
    }

    // 버튼 스타일 적용
    document.querySelectorAll('.time-history-btn_sy a').forEach(btn => {
        btn.classList.remove('active_sy');
    });

    const activeBtn = document.querySelector(`.time-history-btn_sy a[href="?sort=${sort}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active_sy');
    }
});
