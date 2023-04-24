
function leggTilHistory() {
    let history = JSON.parse(localStorage.getItem("history"));

    if (history == null) {
        history = [];
        console.log("history er null")
    }
    let currentUrl = window.location.href;

    history.push(currentUrl);
    console.log(typeof history)
    localStorage.setItem("history", JSON.stringify(history));
}
function popHistory() {
    let history = JSON.parse(localStorage.getItem("history"));
    let sisteURL = history.pop();
    localStorage.setItem("history", JSON.stringify(history));
    return sisteURL;
}
function clearHistory() {
    localStorage.setItem("history", "[]");
}

function goBack() {
    popHistory();
    let previousPage = popHistory();
    if (previousPage == undefined) {
        previousPage = "home.html";
    }
    window.location.href = previousPage;
}

let backButtons = document.querySelectorAll(".backButton");
for (let i = 0; i < backButtons.length; i++) {
    backButtons[i].addEventListener("click", goBack);
}

