function toggleDropdown() {
    document.getElementById("buildingDropdown_sy").classList.toggle("show");
}

function selectBuilding(name) {
    document.getElementById("selectedBuilding_sy").innerText = name + ' ▼';
    document.getElementById("locationText").innerText = name + " 주변 거래";
    document.getElementById("buildingDropdown_sy").classList.remove("show");
}

window.onclick = function (event) {
    if (!event.target.matches('.dropdown-button_sy')) {
        var dropdowns = document.getElementsByClassName("dropdown-content_sy");
        for (let i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove("show");
        }
    }
}