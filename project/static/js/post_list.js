function toggleDropdown() {
    document.getElementById("buildingDropdown_sy").classList.toggle("show");
}

function selectBuilding(buildingId, buildingName) {
    const url = new URL(window.location.href);
    url.searchParams.set("building_id", buildingId);
    window.location.href = url.toString(); 
    document.getElementById("selectedBuilding_sy").innerText = buildingName;
    document.getElementById("buildingDropdown_sy").classList.remove("show");
}

window.onclick = function (event) {
    const dropdownButton = document.getElementById("selectedBuilding_sy");

    if (!dropdownButton.contains(event.target)) {
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

        if (isBoosted) {
            boostBtn.classList.add("selected_sy");
        }

        boostBtn.addEventListener("click", function () {
            const params = new URLSearchParams(window.location.search);
            const burningFlag = params.get("burning");

            if (burningFlag === "1") {
                params.delete("burning");
            } else {
                params.set("burning", "1");
            }

            // 변경된 쿼리 파라미터로 페이지 이동
            window.location.search = params.toString();
        });
    }

    const friendBtn = document.querySelector("#friendOnlyBtn");

    if (friendBtn) {
        const url = new URL(window.location.href);
        const isFriendOnly = url.searchParams.get("friend_only") === "1";

        if (isFriendOnly) {
            friendBtn.classList.add("selected_sy");
        }

        friendBtn.addEventListener("click", function () {
            console.log("버튼 찾음", friendBtn);
            const params = new URLSearchParams(window.location.search);
            const friendFlag = params.get("friend_only");

            if (friendFlag === "1") {
                params.delete("friend_only");
            } else {
                params.set("friend_only", "1");
            }

            // 변경된 쿼리 파라미터로 페이지 이동
            window.location.search = params.toString();
        });
    }
});
