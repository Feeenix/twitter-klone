let history = localStorage.getItem("history");

if (history == null) {
    history = [];
}
let currentUrl = window.location.href;

history.push(currentUrl);
localStorage.setItem("history", history);