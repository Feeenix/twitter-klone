// filen inneholder alt som har med tilbakeknappen å gjøre
// history blir lagret i localstorage, og når brukeren trykker på tilbakeknappen, så blir den siste urlen i historyen hentet ut og brukt
function leggTilHistory() {
    // legger til denne urlen i historyen

    let history = JSON.parse(localStorage.getItem("history")); // JSON.parse gjør om teksten som er i localstorage til en array

    if (history == null) {
        history = [];
        console.log("history er null")
    }
    let currentUrl = window.location.href;

    if (history[history.length - 1] == currentUrl) { // sjekker om den siste urlen i historyen er den samme som den nåværende urlen, aka om vi trakk på f5 eller ctrl+r 
        return;
    }
    history.push(currentUrl); // legger til urlen og lagrer dataen i localstorage
    localStorage.setItem("history", JSON.stringify(history)); // JSON.stringify gjør om arrayen til tekst som kan lagres i localstorage
}
function popHistory() { // fjerner den siste urlen i historyen og returnerer den
    let history = JSON.parse(localStorage.getItem("history"));
    let sisteURL = history.pop();
    localStorage.setItem("history", JSON.stringify(history));
    return sisteURL;
}
function clearHistory() { // tømmer historyen ved å sette den til en tom array
    localStorage.setItem("history", "[]");
}

function goBack() { // går tilbake til forrige side
    popHistory(); // fjerner den nåværende siden fra historyen
    let previousPage = popHistory(); // henter ut den forrige siden fra historyen
    if (previousPage == undefined) {
        previousPage = "home.html";
    }
    window.location.href = previousPage; // går til den forrige siden
}

let backButtons = document.querySelectorAll(".backButton"); // lager event listeners på alle tilbakeknappene
for (let i = 0; i < backButtons.length; i++) {
    backButtons[i].addEventListener("click", goBack);
}



