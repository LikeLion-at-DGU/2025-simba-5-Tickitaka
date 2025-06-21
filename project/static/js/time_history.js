document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const sort = params.get('sort') || 'all';

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
});
