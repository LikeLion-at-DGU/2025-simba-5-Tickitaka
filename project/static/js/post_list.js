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

document.addEventListener("DOMContentLoaded", function () {
    const boostBtn = document.querySelector(".time-boost-btn_sy button");

    if (boostBtn) {
        const url = new URL(window.location.href);
        const isBoosted = url.searchParams.get("burning") === "1";

        // 최초 로딩 시 클래스 반영
        if (isBoosted) {
            boostBtn.classList.add("selected_sy");
        }

        boostBtn.addEventListener("click", function () {
            const params = new URLSearchParams(window.location.search);
            const burningFlag = params.get("burning");

            if (burningFlag === "1") {
                // remove burning flag
                params.delete("burning");
            } else {
                // add burning flag
                params.set("burning", "1");
            }

            // 변경된 쿼리 파라미터로 페이지 이동
            window.location.search = params.toString();
        });
    }
});
